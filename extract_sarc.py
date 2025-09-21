import struct
import os

def calc_hash(name, hash_multiplier):
    result = 0
    for c in name:
        result = ord(c) + (result * hash_multiplier)
        result &= 0xFFFFFFFF
    return result

with open('/Users/ten/WhisperingOrchids/jagxclean.sarc', 'rb') as f:
    data = f.read()

# Determine endianness from the SARC header's byte order mark
# Read the first 8 bytes to get the magic and byte order
magic = data[0:4].decode('ascii')
byte_order_val = struct.unpack('>H', data[6:8])[0]

if byte_order_val == 0xFFFE:
    endian = '<' # Little-endian
else:
    endian = '>' # Big-endian

# SARC Header
header_size = struct.unpack(endian + 'H', data[4:6])[0]
file_size = struct.unpack(endian + 'I', data[8:12])[0]
data_offset = struct.unpack(endian + 'I', data[12:16])[0]
unknown = struct.unpack(endian + 'I', data[16:20])[0]

print(f'magic: {magic}, header_size: {header_size}, byte_order: {byte_order_val}, file_size: {file_size}, data_offset: {data_offset}, unknown: {unknown}')

# SFAT Header
sfat_header_offset = header_size # SFAT header immediately follows SARC header
sfat_header = struct.unpack(endian + '4sHH', data[sfat_header_offset:sfat_header_offset+8])
sfat_magic, sfat_header_size, node_count = sfat_header

print(f'sfat magic: {sfat_magic}, sfat header_size: {sfat_header_size}, node_count: {node_count}')

hash_multiplier = struct.unpack(endian + 'I', data[sfat_header_offset+8:sfat_header_offset+12])[0]

# SFAT Nodes
sfat_nodes = []
for i in range(node_count):
    node_offset = sfat_header_offset + 12 + i * 16
    node_data = data[node_offset:node_offset+16]
    node = struct.unpack(endian + 'IIII', node_data)
    sfat_nodes.append(node)

# SFNT Header
sfnt_offset = sfat_header_offset + 12 + node_count * 16
print(f'sfnt_offset: {sfnt_offset}')
sfnt_header = struct.unpack(endian + '4sHH', data[sfnt_offset:sfnt_offset+8])
sfnt_magic, sfnt_header_size, sfnt_reserved = sfnt_header

# SFNT Data (Filenames)
filenames = {}
current_sfnt_data_offset = sfnt_offset + 8
for node in sfat_nodes:
    filename_offset_in_sfnt = node[1] & 0xFFFFFF
    start = current_sfnt_data_offset + filename_offset_in_sfnt
    end = data.find(b'\x00', start)
    
    if end > start:
        filename = data[start:end].decode('utf-8')
    else:
        filename = '' # Empty filename

    filenames[node[0]] = filename

# Create output directory
output_dir = '/Users/ten/WhisperingOrchids/sarc_extracted'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Extract File Data
# The actual file data starts at data_offset, and the first file is aligned to 0x100
# Subsequent files are aligned to 0x80
# For simplicity, we'll just use the offsets provided in the SFAT nodes relative to the data_offset

for node in sfat_nodes:
    filename = filenames[node[0]]
    
    if not filename: # Skip empty filenames
        print(f'Skipping empty filename for node: {node}')
        continue

    print(f'Extracting: {filename}')
    full_path = os.path.join(output_dir, filename)
    
    # Check if the filename indicates a directory
    if filename.endswith('/'):
        if not os.path.exists(full_path):
            os.makedirs(full_path)
    else:
        file_data_offset = data_offset + node[2]
        file_data_end_offset = data_offset + node[3]
        file_data = data[file_data_offset:file_data_end_offset]
        with open(full_path, 'wb') as f:
            f.write(file_data)

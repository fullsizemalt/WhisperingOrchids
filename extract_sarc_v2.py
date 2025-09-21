import struct
import os

def guess_file_extension(data):
    if len(data) < 4: # Need at least 4 bytes for magic
        return '.bin'

    magic = data[0:4]

    if magic == b"SARC": return '.sarc'
    elif magic == b"Yaz0": return '.szs'
    elif magic == b"YB" or magic == b"BY": return '.byaml'
    elif magic == b"FRES": return '.bfres'
    elif magic == b"Gfx2": return '.gtx'
    elif magic == b"FLYT": return '.bflyt'
    elif magic == b"CLAN": return '.bclan'
    elif magic == b"CLYT": return '.bclyt'
    elif magic == b"FLIM": return '.bclim'
    elif magic == b"FLAN": return '.bflan'
    elif magic == b"FSEQ": return '.bfseq'
    elif magic == b"VFXB": return '.pctl'
    elif magic == b"AAHS": return '.sharc'
    elif magic == b"BAHS": return '.sharcb'
    elif magic == b"BNTX": return '.bntx'
    elif magic == b"BNSH": return '.bnsh'
    elif magic == b"FSHA": return '.bfsha'
    elif magic == b"FFNT": return '.bffnt'
    elif magic == b"CFNT": return '.bcfnt'
    elif magic == b"CSTM": return '.bcstm'
    elif magic == b"FSTM": return '.bfstm'
    elif magic == b"STM": return '.bfstm' # Corrected typo from C# code
    elif magic == b"CWAV": return '.bcwav'
    elif magic == b"FWAV": return '.bfwav'
    elif magic == b"CTPK": return '.ctpk'
    elif magic == b"CGFX": return '.bcres'
    elif magic == b"AAMP": return '.aamp'
    elif magic == b"MsgS": return '.msbt' # MsgStdBn
    elif magic == b"MsgP": return '.msbp' # MsgPrjBn
    
    # Check for PNG magic
    if magic == b'\x89PNG': return '.png'
    # Check for JPEG magic
    if magic == b'\xff\xd8\xff\xe0' or magic == b'\xff\xd8\xff\xe1': return '.jpg'

    return '.bin'

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

# SFAT Header
sfat_header_offset = header_size # SFAT header immediately follows SARC header
sfat_magic = data[sfat_header_offset:sfat_header_offset+4].decode('ascii')
sfat_header_size = struct.unpack(endian + 'H', data[sfat_header_offset+4:sfat_header_offset+6])[0]
node_count = struct.unpack(endian + 'H', data[sfat_header_offset+6:sfat_header_offset+8])[0]

hash_multiplier = struct.unpack(endian + 'I', data[sfat_header_offset+8:sfat_header_offset+12])[0]

# SFAT Nodes
sfat_nodes = []
for i in range(node_count):
    node_offset = sfat_header_offset + 12 + i * 16
    node_hash = struct.unpack(endian + 'I', data[node_offset:node_offset+4])[0]
    attributes = struct.unpack(endian + 'I', data[node_offset+4:node_offset+8])[0]
    file_bool = (attributes >> 24) & 0xFF
    unknown1 = (attributes >> 16) & 0xFF
    file_name_offset_in_sfnt = attributes & 0xFFFF
    node_offset_val = struct.unpack(endian + 'I', data[node_offset+8:node_offset+12])[0]
    eon = struct.unpack(endian + 'I', data[node_offset+12:node_offset+16])[0]
    sfat_nodes.append({
        'hash': node_hash,
        'file_bool': file_bool,
        'unknown1': unknown1,
        'file_name_offset_in_sfnt': file_name_offset_in_sfnt,
        'node_offset_val': node_offset_val,
        'eon': eon
    })

print("SFAT Nodes:")
for node in sfat_nodes:
    print(node)

# SFNT Header
sfnt_offset = sfat_header_offset + sfat_header_size + (node_count * 16) # Corrected SFNT offset
sfnt_magic = data[sfnt_offset:sfnt_offset+4].decode('ascii')
sfnt_header_size = struct.unpack(endian + 'H', data[sfnt_offset+4:sfnt_offset+6])[0]
sfnt_reserved = struct.unpack(endian + 'H', data[sfnt_offset+6:sfnt_offset+8])[0]

# SFNT Data (Filenames)
# This will store the actual filenames from the SFNT section, indexed by their offset
sfnt_filenames_by_offset = {}
current_sfnt_data_offset = sfnt_offset + sfnt_header_size

# Iterate through the SFNT data to extract all null-terminated strings
# and store them with their starting offset
start_of_name = current_sfnt_data_offset
while start_of_name < len(data):
    end_of_name = data.find(b'\x00', start_of_name)
    if end_of_name == -1: # No more null terminators
        break
    
    name = data[start_of_name:end_of_name].decode('latin-1')
    
    # Store the filename with its offset relative to the start of SFNT data
    sfnt_filenames_by_offset[start_of_name - current_sfnt_data_offset] = name
    
    start_of_name = end_of_name + 1
    # Align to 4 bytes
    if (start_of_name - current_sfnt_data_offset) % 4 != 0:
        start_of_name += (4 - ((start_of_name - current_sfnt_data_offset) % 4))

# Map hashes to filenames
filenames = {}
for node in sfat_nodes:
    if node['file_bool'] == 1:
        # Filename is directly in SFNT, use its offset to look up the name
        filename = sfnt_filenames_by_offset.get(node['file_name_offset_in_sfnt'], '{:08X}.bin'.format(node['hash']))
        filenames[node['hash']] = filename
    else:
        # Filename is not directly in SFNT, use hash and guess extension
        filenames[node['hash']] = '{:08X}.bin'.format(node['hash']) # Placeholder, will be updated with actual extension

# Create output directory
output_dir = '/Users/ten/WhisperingOrchids/sarc_extracted'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Extract File Data
for node in sfat_nodes:
    filename = filenames[node['hash']]
    
    file_start_in_sarc = data_offset + node['node_offset_val']
    file_end_in_sarc = data_offset + node['eon']
    file_data = data[file_start_in_sarc:file_end_in_sarc]

    # Update filename with guessed extension if it's a placeholder name
    if '.bin' in filename: # Check if it's a placeholder name
        guessed_ext = guess_file_extension(file_data)
        filename = '{:08X}{}'.format(node['hash'], guessed_ext)
        filenames[node['hash']] = filename # Update for consistency

    print(f'Extracting: {filename}')
    full_path = os.path.join(output_dir, filename)
    
    # Ensure directory exists for subdirectories within SARC
    dir_name = os.path.dirname(full_path)
    if dir_name and not os.path.exists(dir_name):
        os.makedirs(dir_name)

    with open(full_path, 'wb') as f:
        f.write(file_data)

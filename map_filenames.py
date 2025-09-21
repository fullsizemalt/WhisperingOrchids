import json
import os
import struct

def calc_hash(name, hash_multiplier=0x65):
    result = 0
    for c in name:
        result = ord(c) + (result * hash_multiplier)
        result &= 0xFFFFFFFF
    return result

with open('/Users/ten/WhisperingOrchids/sarc_extracted/o.json', 'r') as f:
    o_json_content = f.read()

o_data = json.loads(o_json_content)

file_mappings = {}
for file_entry in o_data['Files']:
    filename_in_json = file_entry['FileName']
    calculated_hash = calc_hash(filename_in_json)
    file_mappings[calculated_hash] = filename_in_json
    print('Filename from o.json: {}, Calculated Hash: {:08X}'.format(filename_in_json, calculated_hash))

# Now, rename the files in sarc_extracted
output_dir = '/Users/ten/WhisperingOrchids/sarc_extracted'
for filename_in_dir in os.listdir(output_dir):
    if filename_in_dir.endswith('.bin') or filename_in_dir.endswith('.bflyt') or filename_in_dir.endswith('.bflan') or filename_in_dir.endswith('.jpg') or filename_in_dir.endswith('.json'):
        # Extract hash from filename (assuming it's in X8 format)
        try:
            file_hash_str = filename_in_dir.split('.')[0]
            file_hash_int = int(file_hash_str, 16)
        except ValueError:
            print(f"Skipping {filename_in_dir}: Not a hash-based filename.")
            continue

        if file_hash_int in file_mappings:
            original_filename = file_mappings[file_hash_int]
            old_path = os.path.join(output_dir, filename_in_dir)
            new_path = os.path.join(output_dir, original_filename)

            # Ensure parent directories exist for the new path
            new_dir = os.path.dirname(new_path)
            if new_dir and not os.path.exists(new_dir):
                os.makedirs(new_dir)

            os.rename(old_path, new_path)
            print(f'Renamed {filename_in_dir} to {original_filename}')
        else:
            print(f'No mapping found for {filename_in_dir}')

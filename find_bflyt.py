import os

output_dir = '/Users/ten/WhisperingOrchids/sarc_extracted'

for filename in os.listdir(output_dir):
    full_path = os.path.join(output_dir, filename)
    if os.path.isfile(full_path):
        with open(full_path, 'rb') as f:
            magic = f.read(4)
            if magic == b'FLYT':
                print(f'Found BFLYT file: {filename}')
            else:
                print(f'File: {filename}, Magic: {magic}')
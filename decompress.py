import libyaz0

with open('/Users/ten/WhisperingOrchids/jagxclean.nxtheme', 'rb') as f:
    data = f.read()

decompressed_data = libyaz0.decompress(data)

with open('/Users/ten/WhisperingOrchids/jagxclean.sarc', 'wb') as f:
    f.write(decompressed_data)

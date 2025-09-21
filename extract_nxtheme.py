import struct

with open('/Users/ten/WhisperingOrchids/jagxclean.nxtheme', 'rb') as f:
    data = f.read()

yaz0_end = data.find(b'IHDR', 0x4890) - 8
yaz0_data = data[:yaz0_end]
with open('/Users/ten/WhisperingOrchids/jagxclean.yaz0', 'wb') as f:
    f.write(yaz0_data)

png_start = yaz0_end
png_end = data.find(b'IEND') + 8
png_data = data[png_start:png_end]
with open('/Users/ten/WhisperingOrchids/image.png', 'wb') as f:
    f.write(png_data)

json_data = data[png_end:]
with open('/Users/ten/WhisperingOrchids/layout.json', 'wb') as f:
    f.write(json_data)

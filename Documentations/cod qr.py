"""
Acest script este un tool de dezvoltare independent utilizat pentru a genera codul qr al site-lui. 
Pentru a-l rula local, instalați dependințele necesare:
> pip install qrcode[pil] Pillow

"""

import qrcode
from PIL import Image

qr = qrcode.QRCode(
    version=5,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)
qr.add_data('https://fermo.top/The-inventory/')
qr.make(fit=True)

qr_img = qr.make_image(fill_color="#38BDF8", back_color="white").convert('RGB')

logo = Image.open('box.png').convert('RGBA')

basewidth = int(qr_img.size[0] / 3.4)
wpercent = (basewidth / float(logo.size[0]))
hsize = int((float(logo.size[1]) * float(wpercent)))
logo = logo.resize((basewidth, hsize), Image.Resampling.LANCZOS)

white_bg = Image.new('RGB', logo.size, 'white')
white_bg.paste(logo, (0, 0), logo)

pos = ((qr_img.size[0] - logo.size[0]) // 2, (qr_img.size[1] - logo.size[1]) // 2)

qr_img.paste(white_bg, pos)

qr_img.save('QR.png')
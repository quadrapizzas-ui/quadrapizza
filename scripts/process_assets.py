import os
import numpy as np
from PIL import Image, ImageEnhance, ImageOps
from rembg import remove, new_session
from scipy.ndimage import binary_erosion, gaussian_filter

INPUT_DIR = r"C:\Users\angel\OneDrive\futuriza\proyectos\quadra-pizza\estilos visuales\contenido\img"
OUTPUT_DIR = r"c:\Users\angel\OneDrive\futuriza\proyectos\quadra-pizza\quadra-pizza-erp\public\products"
PUBLIC_DIR = r"c:\Users\angel\OneDrive\futuriza\proyectos\quadra-pizza\quadra-pizza-erp\public"

os.makedirs(OUTPUT_DIR, exist_ok=True)

print("Iniciando sesión U2NetP...")
session = new_session('u2netp')

def defringe_and_clean(img_rgba, is_pizza=False):
    arr = np.array(img_rgba)
    if arr.shape[2] != 4:
        return img_rgba
    
    r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
    
    # 1. Erode alpha mask slightly to kill the 1-2px outer boundary
    opaque_mask = a > 140
    # For pizza, preserve the delicate smoke/steam by using a milder erosion
    k_size = 3 if is_pizza else 5
    structure = np.ones((k_size, k_size), dtype=bool)
    eroded_mask = binary_erosion(opaque_mask, structure=structure)
    
    # Smooth alpha boundary
    smooth_alpha = gaussian_filter(eroded_mask.astype(np.float32) * 255.0, sigma=0.7)
    smooth_alpha = np.clip(smooth_alpha, 0, 255).astype(np.uint8)
    
    # If pizza, keep original steam/smoke with lower opacity
    if is_pizza:
        steam_zone = (a > 20) & (a <= 140)
        smooth_alpha[steam_zone] = (a[steam_zone] * 0.7).astype(np.uint8)

    # 2. Despill: Neutralize background orange fringing on the border
    edge_zone = (smooth_alpha > 5) & (smooth_alpha < 240)
    
    new_r = r.copy()
    new_g = g.copy()
    new_b = b.copy()
    
    # Calculate excess red compared to green/blue
    red_excess = np.maximum(0, new_r.astype(np.int32) - (new_g.astype(np.int32) * 1.35).astype(np.int32))
    new_r[edge_zone] = np.clip(new_r[edge_zone].astype(np.int32) - (red_excess[edge_zone] * 0.45).astype(np.int32), 0, 255).astype(np.uint8)
    
    cleaned_arr = np.dstack([new_r, new_g, new_b, smooth_alpha])
    return Image.fromarray(cleaned_arr, 'RGBA')

def pad_and_center(img_rgba, target_size=(1000, 1000), padding_pct=0.08):
    bbox = img_rgba.getbbox()
    if not bbox:
        return img_rgba.resize(target_size, Image.Resampling.LANCZOS)
    
    cropped = img_rgba.crop(bbox)
    cw, ch = cropped.size
    
    # Fit into target_size with padding
    max_w = int(target_size[0] * (1 - 2 * padding_pct))
    max_h = int(target_size[1] * (1 - 2 * padding_pct))
    
    scale = min(max_w / cw, max_h / ch)
    new_w, new_h = max(1, int(cw * scale)), max(1, int(ch * scale))
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new('RGBA', target_size, (0, 0, 0, 0))
    pos_x = (target_size[0] - new_w) // 2
    pos_y = (target_size[1] - new_h) // 2
    canvas.paste(resized, (pos_x, pos_y), resized)
    return canvas

# MAPPING OF SOURCE REAL IMAGES
PRODUCT_MAPPING = [
    {
        "source": "WhatsApp Image 2026-10-14 at 12.16.59 AM (1).jpeg",
        "output": "quadra-pizza-signature.webp",
        "is_pizza": True,
        "name": "Pizza Rectangular Quadra"
    },
    {
        "source": "WhatsApp Image 2026-10-14 at 12.16.58 AM.jpeg",
        "output": "burger-quadra-egg.webp",
        "is_pizza": False,
        "name": "Burger Smash con Huevo"
    },
    {
        "source": "WhatsApp Image 2026-10-14 at 12.16.58 AM (4).jpeg",
        "output": "burger-doble-bacon.webp",
        "is_pizza": False,
        "name": "Burger Doble Bacon Beast"
    },
    {
        "source": "WhatsApp Image 2026-10-14 at 12.16.58 AM (1).jpeg",
        "output": "sandwich-milanesa.webp",
        "is_pizza": False,
        "name": "Sándwich de Milanesa Completo"
    },
    {
        "source": "WhatsApp Image 2026-10-14 at 12.16.58 AM (2).jpeg",
        "output": "lomito-cordobes-arabe.webp",
        "is_pizza": False,
        "name": "Lomito Cordobés en Pan Árabe"
    },
    {
        "source": "WhatsApp Image 2026-10-14 at 12.16.59 AM.jpeg",
        "output": "super-lomito-papas.webp",
        "is_pizza": False,
        "name": "Súper Lomito Quadra con Papas"
    },
    {
        "source": "WhatsApp Image 2026-10-14 at 12.16.58 AM (3).jpeg",
        "output": "vaso-mini-burgers.webp",
        "is_pizza": False,
        "name": "Copa Quadra Mini Burgers"
    },
]

def process_super_lomito(src_path, out_path, session):
    orig = Image.open(src_path)
    orig_arr = np.array(orig)
    orig_h, orig_w, _ = orig_arr.shape

    raw_u2 = remove(orig, session=session)
    raw_arr = np.array(raw_u2)
    sandwich_alpha = raw_arr[:, :, 3].copy()
    sandwich_alpha[980:, :] = 0
    sandwich_mask = sandwich_alpha > 60
    sandwich_mask = binary_erosion(sandwich_mask, structure=np.ones((3,3), dtype=bool))
    smooth_sandwich_alpha = gaussian_filter(sandwich_mask.astype(float)*255.0, sigma=0.6)
    smooth_sandwich_alpha = np.clip(smooth_sandwich_alpha, 0, 255).astype(np.uint8)

    r = orig_arr[:, :, 0].astype(float)
    g = orig_arr[:, :, 1].astype(float)
    b = orig_arr[:, :, 2].astype(float)

    fry_metric = g - 0.40 * r
    exact_fry_sticks = (fry_metric > 3.0) & (g > 68) & (r > 90)
    exact_fry_sticks[:990, :] = False
    exact_fry_sticks[1180:, :] = False
    exact_fry_sticks[:, :45] = False
    exact_fry_sticks[:, 815:] = False
    exact_fry_sticks[1165:, 550:] = False  # Excluir logo #QUADRA
    exact_fry_sticks[1144:, 680:] = False  # Excluir destello del afiche

    import scipy.ndimage as ndi
    body_region = exact_fry_sticks.copy()
    body_region[:1030, :] = False
    struct = np.ones((11, 11), dtype=bool)
    closed_body = ndi.binary_closing(body_region, structure=struct)
    filled_body = ndi.binary_fill_holes(closed_body)

    full_fry_mask = exact_fry_sticks.copy()
    full_fry_mask[1030:, :] = filled_body[1030:, :]

    labeled, num_features = ndi.label(full_fry_mask)
    sizes = ndi.sum(full_fry_mask, labeled, range(num_features + 1))
    clean_fries_mask = np.zeros_like(full_fry_mask)
    for i in range(1, num_features + 1):
        if sizes[i] > 180:
            clean_fries_mask[labeled == i] = True

    fade_bottom = np.ones_like(clean_fries_mask, dtype=float)
    for y in range(1156, 1176):
        fade_bottom[y, :] = (1176 - y) / 20.0
    fade_bottom[1176:, :] = 0.0

    fries_alpha = gaussian_filter(clean_fries_mask.astype(float) * 255.0, sigma=0.6)
    fries_alpha = np.clip(fries_alpha * fade_bottom, 0, 255).astype(np.uint8)

    edge_fries = (fries_alpha > 5) & (fries_alpha < 240)
    new_r = orig_arr[:, :, 0].copy()
    new_g = orig_arr[:, :, 1].copy()
    new_b = orig_arr[:, :, 2].copy()

    red_excess = np.maximum(0, new_r.astype(np.int32) - (new_g.astype(np.int32) * 1.25).astype(np.int32))
    new_r[edge_fries] = np.clip(new_r[edge_fries].astype(np.int32) - (red_excess[edge_fries] * 0.55).astype(np.int32), 0, 255).astype(np.uint8)

    sandwich_rgba = np.dstack([orig_arr[:, :, 0], orig_arr[:, :, 1], orig_arr[:, :, 2], smooth_sandwich_alpha])
    fries_rgba = np.dstack([new_r, new_g, new_b, fries_alpha])

    img_sandwich = Image.fromarray(sandwich_rgba, 'RGBA')
    img_fries = Image.fromarray(fries_rgba, 'RGBA')

    crop_s = img_sandwich.crop(img_sandwich.getbbox())
    crop_f = img_fries.crop(img_fries.getbbox())

    fw, fh = crop_f.size
    f_shadow_arr = np.zeros((fh + 40, fw + 60, 4), dtype=np.uint8)
    sy_c = fh + 2
    sx_c = (fw + 60) // 2
    s_rx = fw // 2 + 10
    s_ry = 14
    Y, X = np.ogrid[:fh + 40, :fw + 60]
    dist_s = np.sqrt(((X - sx_c) / float(s_rx))**2 + ((Y - sy_c) / float(s_ry))**2)
    s_mask = np.clip((1.0 - dist_s) * 160.0, 0, 160).astype(np.uint8)
    s_mask = gaussian_filter(s_mask.astype(float), sigma=4.5).astype(np.uint8)

    f_shadow_arr[:, :, 0] = 35
    f_shadow_arr[:, :, 1] = 12
    f_shadow_arr[:, :, 2] = 2
    f_shadow_arr[:, :, 3] = s_mask
    f_shadow_layer = Image.fromarray(f_shadow_arr, 'RGBA')

    gap = 28
    total_w = max(crop_s.width, crop_f.width) + 40
    total_h = crop_s.height + gap + crop_f.height + 25

    comp_canvas = Image.new('RGBA', (total_w, total_h), (0, 0, 0, 0))
    s_x = (total_w - crop_s.width) // 2
    comp_canvas.paste(crop_s, (s_x, 0), crop_s)

    f_x = (total_w - crop_f.width) // 2
    f_y = crop_s.height + gap
    comp_canvas.paste(f_shadow_layer, (f_x - 30, f_y - 8), f_shadow_layer)
    comp_canvas.paste(crop_f, (f_x, f_y), crop_f)

    target_size = (1000, 1000)
    padding_pct = 0.06
    max_w = int(target_size[0] * (1 - 2 * padding_pct))
    max_h = int(target_size[1] * (1 - 2 * padding_pct))
    scale = min(max_w / total_w, max_h / total_h)
    nw, nh = int(total_w * scale), int(total_h * scale)
    resized = comp_canvas.resize((nw, nh), Image.Resampling.LANCZOS)

    master_canvas = Image.new('RGBA', target_size, (0, 0, 0, 0))
    master_canvas.paste(resized, ((1000 - nw) // 2, (1000 - nh) // 2), resized)

    # Enhance color & contrast slightly
    rgb = master_canvas.convert('RGB')
    alpha = master_canvas.split()[-1]
    enh_color = ImageEnhance.Color(rgb).enhance(1.08)
    enh_contrast = ImageEnhance.Contrast(enh_color).enhance(1.06)
    enh_sharpness = ImageEnhance.Sharpness(enh_contrast).enhance(1.08)
    final = Image.merge('RGBA', (*enh_sharpness.split(), alpha))
    final.save(out_path, format="WEBP", quality=95, method=6)
    print(f" -> Guardado exitoso con papas completas y sombra 3D: {out_path}")

print("Procesando comidas reales...")
for item in PRODUCT_MAPPING:
    src_path = os.path.join(INPUT_DIR, item["source"])
    out_path = os.path.join(OUTPUT_DIR, item["output"])
    
    if not os.path.exists(src_path):
        print(f"Alerta: No encontrado {src_path}")
        continue
    
    print(f"Procesando {item['name']} ({item['source']})...")
    if item["output"] == "super-lomito-papas.webp":
        process_super_lomito(src_path, out_path, session)
        continue

    raw = Image.open(src_path)
    cutout = remove(raw, session=session)
    cleaned = defringe_and_clean(cutout, is_pizza=item["is_pizza"])
    framed = pad_and_center(cleaned, target_size=(1000, 1000))
    framed.save(out_path, format="WEBP", quality=92, method=6)
    print(f" -> Guardado exitoso: {out_path}")

# CALIBRATE LOCAL.JPEG
local_src = os.path.join(INPUT_DIR, "local.jpeg")
local_out = os.path.join(OUTPUT_DIR, "local-fachada-yocsina.webp")

if os.path.exists(local_src):
    print("Calibrando imagen del local (local.jpeg)...")
    loc_img = Image.open(local_src).convert("RGB")
    loc_arr = np.array(loc_img, dtype=np.float32)
    
    # 1. Enrich facade orange and warm highlights
    r, g, b = loc_arr[:,:,0], loc_arr[:,:,1], loc_arr[:,:,2]
    
    # Facade mask: middle vertical area with orange paint
    facade_mask = (r > 120) & (r > g) & (g > b * 0.8) & (loc_arr[:,:,0] < 220)
    # Boost orange saturation towards Master Quadra Orange
    r[facade_mask] = np.clip(r[facade_mask] * 1.25, 0, 255)
    g[facade_mask] = np.clip(g[facade_mask] * 0.88, 0, 255)
    b[facade_mask] = np.clip(b[facade_mask] * 0.55, 0, 255)
    
    # 2. Deepen top sky to pure obsidian #09090b
    h, w, _ = loc_arr.shape
    sky_mask = np.zeros((h, w), dtype=bool)
    sky_mask[:int(h*0.14), :] = (r[:int(h*0.14), :] < 80) & (g[:int(h*0.14), :] < 80)
    r[sky_mask] = 9
    g[sky_mask] = 9
    b[sky_mask] = 11
    
    # 3. Enhance #QUADRA sign luminescence (white 3D letters)
    sign_mask = (loc_arr > 190).all(axis=2) & (loc_arr[:,:,0] > 180)
    r[sign_mask] = np.clip(r[sign_mask] * 1.15, 0, 255)
    g[sign_mask] = np.clip(g[sign_mask] * 1.15, 0, 255)
    b[sign_mask] = np.clip(b[sign_mask] * 1.15, 0, 255)
    
    # 4. Neutralize pavement cool cast
    pavement_y = int(h * 0.8)
    pave_mask = np.zeros((h, w), dtype=bool)
    pave_mask[pavement_y:, :] = True
    # Balance color so it's warm clean stone
    mean_pave = (r[pave_mask] + g[pave_mask] + b[pave_mask]) / 3.0
    r[pave_mask] = np.clip(mean_pave * 1.05, 0, 255)
    g[pave_mask] = np.clip(mean_pave * 0.98, 0, 255)
    b[pave_mask] = np.clip(mean_pave * 0.92, 0, 255)
    
    calibrated_loc = np.dstack([r, g, b]).astype(np.uint8)
    loc_final = Image.fromarray(calibrated_loc)
    
    # Enhance overall contrast and sharpness slightly
    loc_final = ImageEnhance.Contrast(loc_final).enhance(1.15)
    loc_final = ImageEnhance.Sharpness(loc_final).enhance(1.1)
    
    loc_final.save(local_out, format="WEBP", quality=92, method=6)
    print(f" -> Local guardado exitoso: {local_out}")

# ALSO PROCESS EXISTING EMPANADAS & BEVERAGES/DESSERTS FOR 100% UNIFORM FLOATING CATALOG
SECONDARY_MAPPING = [
    {"source": os.path.join(PUBLIC_DIR, "2.webp"), "output": "empanadas-caseras.webp"},
    {"source": os.path.join(PUBLIC_DIR, "coca.webp"), "output": "coca-cola.webp"},
    {"source": os.path.join(PUBLIC_DIR, "cerveza.webp"), "output": "cerveza-quilmes.webp"},
    {"source": os.path.join(PUBLIC_DIR, "postre.png"), "output": "flan-casero.webp"},
    {"source": os.path.join(PUBLIC_DIR, "tiramisu.png"), "output": "tiramisu-artesanal.webp"},
]

print("Procesando empanadas y bebidas para que el 100% del catálogo flote...")
for item in SECONDARY_MAPPING:
    if os.path.exists(item["source"]):
        out_path = os.path.join(OUTPUT_DIR, item["output"])
        raw = Image.open(item["source"])
        cutout = remove(raw, session=session)
        cleaned = defringe_and_clean(cutout, is_pizza=False)
        framed = pad_and_center(cleaned, target_size=(1000, 1000))
        framed.save(out_path, format="WEBP", quality=90, method=6)
        print(f" -> Guardado secundario: {out_path}")

print("¡PROCESAMIENTO COMPLETO DE TODOS LOS ASSETS FINALIZADO!")

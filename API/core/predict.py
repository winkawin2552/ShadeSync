import numpy as np
import torch
from torchvision import transforms
from PIL import Image

def sliding_window_predict(full_image, model):
    img_np = np.array(full_image)
    H, W, _ = img_np.shape
    mask = np.zeros((H, W))
    tile = 256

    transform = transforms.Compose([
        transforms.Resize((tile, tile)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])

    for y in range(0, H, tile):
        for x in range(0, W, tile):
            patch = img_np[y:y+tile, x:x+tile]

            ph, pw, _ = patch.shape
            padded = np.zeros((tile, tile, 3), dtype=np.uint8)
            padded[:ph, :pw] = patch

            inp = transform(Image.fromarray(padded)).unsqueeze(0)

            with torch.no_grad():
                pred = torch.sigmoid(model(inp)).squeeze().numpy()

            mask[y:y+ph, x:x+pw] = pred[:ph, :pw]

    return (mask > 0.5).astype(np.uint8)

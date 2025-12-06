import segmentation_models_pytorch as smp
import torch

def load_unet(model_path):
    model = smp.Unet(
        encoder_name="resnet34",
        encoder_weights=None,
        in_channels=3,
        classes=1
    )
    model.load_state_dict(torch.load(model_path, map_location="cpu"))
    model.eval()
    return model

import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np

class FeatureExtractor:
    def __init__(self):
        # Use ResNet50 pretrained on ImageNet
        self.model = models.resnet50(pretrained=True)
        # Remove the last classification layer (FC layer)
        self.model = nn.Sequential(*list(self.model.children())[:-1])
        self.model.eval()
        
        # Standard ImageNet normalization
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

    def extract(self, img_path):
        img = Image.open(img_path).convert('RGB')
        img_tensor = self.transform(img).unsqueeze(0)
        
        with torch.no_grad():
            features = self.model(img_tensor)
            
        # Flatten the features (2048-dim vector for ResNet50)
        features = features.squeeze().numpy()
        # L2 Normalize for cosine similarity
        norm = np.linalg.norm(features)
        if norm > 0:
            features = features / norm
        return features

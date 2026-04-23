"""
Train a two-class classifier for Ashwagandha vs Tulsi.

Expected dataset layouts (either works):
1) dataset_root/train/ashwagandha, dataset_root/train/tulsi, dataset_root/test/...
2) dataset_root/ashwagandha, dataset_root/tulsi (auto split)
"""

import argparse
import os
import tensorflow as tf

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
CANONICAL_CLASSES = {"ashwagandha", "tulsi"}
CLASS_ALIASES = {
    "ashwagandha": "ashwagandha",
    "ashwghandha": "ashwagandha",
    "tulsi": "tulsi",
    "tulasi": "tulsi"
}


def normalize_class_name(name: str) -> str:
    key = str(name).strip().lower()
    return CLASS_ALIASES.get(key, key)


def load_datasets(dataset_root: str):
    train_dir = os.path.join(dataset_root, "train")
    test_dir = os.path.join(dataset_root, "test")

    if os.path.isdir(train_dir):
        train_ds = tf.keras.utils.image_dataset_from_directory(
            train_dir,
            label_mode="categorical",
            image_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            shuffle=True
        )
        val_ds = tf.keras.utils.image_dataset_from_directory(
            test_dir if os.path.isdir(test_dir) else train_dir,
            label_mode="categorical",
            image_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            shuffle=False
        )
    else:
        train_ds = tf.keras.utils.image_dataset_from_directory(
            dataset_root,
            validation_split=0.2,
            subset="training",
            seed=42,
            label_mode="categorical",
            image_size=IMG_SIZE,
            batch_size=BATCH_SIZE
        )
        val_ds = tf.keras.utils.image_dataset_from_directory(
            dataset_root,
            validation_split=0.2,
            subset="validation",
            seed=42,
            label_mode="categorical",
            image_size=IMG_SIZE,
            batch_size=BATCH_SIZE
        )

    class_names = train_ds.class_names
    normalized = {normalize_class_name(name) for name in class_names}
    if normalized != CANONICAL_CLASSES:
        raise ValueError(
            "Expected classes equivalent to ['ashwagandha', 'tulsi'], "
            f"got {class_names}. Supported aliases: Ashwagandha/Ashwghandha and Tulsi/Tulasi."
        )

    autotune = tf.data.AUTOTUNE
    train_ds = train_ds.prefetch(autotune)
    val_ds = val_ds.prefetch(autotune)
    return train_ds, val_ds, class_names


def build_model():
    base = tf.keras.applications.MobileNetV2(
      input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3),
      include_top=False,
      weights="imagenet"
    )
    base.trainable = False

    # Data Augmentation
    data_augmentation = tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal_and_vertical"),
        tf.keras.layers.RandomRotation(0.2),
        tf.keras.layers.RandomZoom(0.2),
        tf.keras.layers.RandomContrast(0.2),
    ])

    inputs = tf.keras.Input(shape=(IMG_SIZE[0], IMG_SIZE[1], 3))
    x = data_augmentation(inputs)
    x = tf.keras.layers.Rescaling(1.0 / 255)(x)
    x = base(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    x = tf.keras.layers.Dense(128, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    outputs = tf.keras.layers.Dense(2, activation="softmax")(x)
    model = tf.keras.Model(inputs, outputs)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model, base



def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset-root", required=True, help="Path to dataset root")
    parser.add_argument("--output", default="./models/botani_two_plants.keras", help="Output model path")
    parser.add_argument("--epochs", type=int, default=10)
    args = parser.parse_args()

    train_ds, val_ds, class_names = load_datasets(args.dataset_root)
    print(f"Classes: {class_names}")

    model, base = build_model()
    model.fit(train_ds, validation_data=val_ds, epochs=args.epochs)

    # Fine-tune top layers
    base.trainable = True
    for layer in base.layers[:-30]:
        layer.trainable = False
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    model.fit(train_ds, validation_data=val_ds, epochs=max(3, args.epochs // 2))

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    model.save(args.output)
    print(f"Saved model to: {args.output}")


if __name__ == "__main__":
    main()

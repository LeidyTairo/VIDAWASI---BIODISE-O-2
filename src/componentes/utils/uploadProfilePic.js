import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

export const uploadProfilePic = async (file, onUpload) => {
    const storage = getStorage();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error('No se ha autenticado el usuario');
        return;
    }

    // Ruta en Firebase Storage donde se guardará la imagen
    const storageRef = ref(storage, `profilePics/${user.uid}/${file.name}`);

    try {
        // Subir el archivo a Firebase Storage
        const snapshot = await uploadBytes(storageRef, file);

        // Obtener la URL de descarga de la imagen
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Llamar al callback onUpload con la URL de la imagen
        onUpload(downloadURL);

        console.log('Imagen subida correctamente:', downloadURL);
    } catch (error) {
        console.error('Error al subir la imagen:', error);
    }
};

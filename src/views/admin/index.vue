<script>
import { db } from "../../config/firebase";
import { collection, doc, setDoc,addDoc } from "firebase/firestore";

const addFan = async () => {
  try {
    const fanID = "halil"; // Document ID
    const fanRef = doc(db, "fanlar", fanID); // Asosiy document

    // Fan documentini yaratamiz (agar mavjud bo‘lmasa)
    await setDoc(fanRef, { name: "Kimyo" }, { merge: true });

    // Document ichidagi collectionga yangi dars qo‘shamiz
    const darslarRef = collection(fanRef, "beginer"); // Subcollection
    await addDoc(darslarRef, { nomi: "Kimyo 1-dars", davomiylik: "45 min" });

    console.log("✅ Dars fan ichiga qo‘shildi!");
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

addFan();


</script>
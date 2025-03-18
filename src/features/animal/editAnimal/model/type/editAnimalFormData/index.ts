import editAnimalSchemaType from "@/features/animal/editAnimal/model/type/editAnimalSchemaType";

type editAnimalFormData = editAnimalSchemaType & { animalId: string };

export default editAnimalFormData;

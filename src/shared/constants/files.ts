export const imageFileTypesAsString = "image/jpeg, image/png, image/webp" as const;
export const imageFileTypesAsArray = imageFileTypesAsString.split(", ");

export const pdfFileTypesAsString = "application/pdf" as const;
export const pdfFileTypesAsArray = pdfFileTypesAsString.split(", ");




export const handleServerSideValidation = async (errorsData: any, setError: any) => {
  if (!errorsData) return;
  errorsData.detail.forEach((error: any) => {
    const fieldName = error.loc[1]; // Assume que o nome do campo está na segunda posição de 'loc'
    setError(fieldName, {
      type: "server",
      message: error?.msg
    });
  });
}
export async function getTodo () {
    const response = await fetch("https://69b9371be69653ffe6a6eff1.mockapi.io/todos");
    return(response.json());
}
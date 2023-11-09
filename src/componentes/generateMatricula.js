export const generateMatri=(n, ap, am) =>{
    min = Math.ceil(10000000);
    max = Math.ceil(99999999);
    nums = Math.round(Math.random() * (max - min + 1) + min);
    matricula = n[0] + ap[0] + am[0] + nums
    return matricula;
}
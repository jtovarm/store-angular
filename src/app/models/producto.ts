export class Producto{
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public precio: number,
    public date_up: Date,
    public imagen: string
  ){}
}

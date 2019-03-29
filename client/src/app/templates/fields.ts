export interface ISection {
    id: string;
    assigneA: string;
}

export interface ISignature {
    id: string;
    name: string;
    assigneA: string;
    value: string;
    date: Date;
}

export class Signature implements ISignature
{
    id: string; //field ID
    name: string; //Nom à afficher comme label
    assigneA: string; //assigné à quel user
    value: string; //vide ou signé avec les noms de l'usager
    check: boolean; //coché
    validated: boolean; //signé & validé
    lock: boolean; //rendu impossible à modifier
    date: Date; //temps de la soumission de la signature
    
  constructor(id:string, name:string, assignedTo:string, value:string, check:boolean, validated:boolean, lock:boolean, date:Date = null)
  {
    this.id = id;
    this.name = name;
    this.assigneA = assignedTo;
    this.value = value;
    this.check = check;
    this.validated = validated;
    this.lock = lock;
    this.date = date;
  }
  public static fromInterface(sig :ISignature) :Signature
  {
    let lock = sig.value !== "";
    let check = sig.value !== "";
    let validated = sig.value !== "";
    return new Signature(sig.id, sig.name, sig.assigneA, sig.value, check, validated, lock, sig.date)
  }

  public validerSignature()
  {
      // Signature possible si nom existant et case cochée
    this.validated = this.value.length > 0 && this.check;
    this.date = new Date();
  }
  public resetSignature()
  {
      // Annuler toute la signature
    this.validated = false;
    this.value = '';
    this.check = false;
    this.date = null;
  }
  public onButtonClick()
  {
    if (!this.lock)
    {
      if (this.validated)
      {
        this.resetSignature();
      }
      else
      {
        this.validerSignature()
      }
    }
  }
  
  public buttonMessage() : string
  {
    if (this.lock)
    {
      return "---";
    }
    else if (this.validated)
    {
      return "ANNULER";
    }
    else
    {
      return "SIGNER";
    }
  }

  public lockSignature()
  {
    this.lock = true;
  }
}

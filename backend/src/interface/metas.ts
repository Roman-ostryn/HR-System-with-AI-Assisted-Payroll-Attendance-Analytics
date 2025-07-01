interface SpecialUserBonus {
  userId: number;
  bonus: number;
}
  
interface Metas {
  id_grupo: number;
  id_plus: number;
  motivo: string;
  bono_produccion: number;
  specialUserBonuses?: SpecialUserBonus[];
}
  
  export default Metas;



  
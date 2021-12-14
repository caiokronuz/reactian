import {useEffect, useState, createContext} from 'react';
import { history } from '../services/history';
import {toast} from 'react-toastify';
import api from '../services/api';

export const GeneralContext = createContext({})

interface User{
    id: number;
    companyId: number;
    name: string;
}

interface Company{
    id: number;
    name: string;
}

interface Unit {
    id: number;
    name: string;
    companyId: number;
}



function GeneralProvider({children}:any){

    const [userLogged, setUserLogged] = useState<User>()
    const [assets, setAssets] = useState([])
    const [company, setCompany] = useState<Company[]>([])
    const [units, setUnits] = useState<Unit[]>([])

    useEffect(() => {
        async function loadUser(){
            //Verifica se o usuário está logado
            const storageUser = await localStorage.getItem('user')
            if(storageUser){
                setUserLogged(JSON.parse(storageUser))
                return;
            }
        }

        async function getAssets(){
            const {data} = await api.get('assets')
            setAssets(data);
        }

        async function getCompanies(){
            const {data} = await api.get(`companies`)
            setCompany(data);
        }

        async function getUnits() {
            const { data }  = await api.get('units');
            setUnits(data);
        }

        loadUser();
        getAssets();
        getCompanies();
        getUnits();

    },[])

    function signIn(id: Number, companyId: Number, name: String){

        const data = {
            id, 
            companyId,
            name
        }

        localStorage.setItem('user', JSON.stringify(data));
        history.push('/');
        toast.success(`Seja bem-vindo ${name}`)
    }

    const companySelected = company.filter(company => company.id === userLogged?.companyId)[0]
    const companyUnits = units.filter(unit => unit.companyId === companySelected?.id)


    //Essa função recebe o status do ativo e "traduz" o mesmo.
    function translateStatus(status: String){
        if(status === 'inDowntime'){
            return 'Desligada'
        }else if(status === 'inOperation'){
            return 'Em operação'
        }else if(status === 'inAlert'){
            return 'Em alerta'
        }
    }

    return(
        <GeneralContext.Provider value={{
            signed: !!userLogged,
            signIn,
            assets,
            companySelected,
            companyUnits,
            translateStatus,
        }}>
            {children}
        </GeneralContext.Provider>
    )
}

export default GeneralProvider;
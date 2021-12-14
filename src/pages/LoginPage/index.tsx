import { FormEvent, useEffect, useState, useContext } from 'react';
import { GeneralContext } from '../../contexts/general';
import { history } from '../../services/history';
import { toast } from 'react-toastify';

import api from '../../services/api';
import styles from './styles.module.scss';

interface User {
    id: number;
    email: string;
    name: string;
    unitId: number;
    companyId: number;
}

interface Context{
    signIn: (id:Number, companyId: Number, name:String) => void;
}

export default function LoginPage() {

    const {signIn} = useContext(GeneralContext) as Context;


    useEffect(() => {
        async function getUsers() {
            const user = !!localStorage.getItem('user') //Verifica se ja existe um usuário logado
            if (user) {
                //Caso exista um usuário logado, tira o mesmo página de login.
                return history.push('/')
            }

            const { data } = await api.get('users');
            setUsers(data);
        }

        getUsers();
    }, [])

    const [users, setUsers] = useState<User[]>([]);
    const [userSelected, setUserSelected] = useState<Number>(0);

    function handleLogin(e: FormEvent) {
        e.preventDefault();

        if (userSelected === 0) {
            toast.error("Selecione um usuário!")
            return;
        } 

        const {id, companyId, name} = users.filter(user => user.id === userSelected)[0];
        signIn(id, companyId, name) //Função de login do context
    }

    return (
        <div className={styles.loginPage}>
            <div className={styles.mainLeft}>
                <h1>REACTIAN</h1>
                <p>Evite falhas nas suas máquinas e torne o tempo de inatividade uma coisa do passado com sistema preditivo da REACTIAN.</p>
            </div>
            <div className={styles.mainRigth}>
                <h1>Faça login</h1>

                <form className={styles.formLogin} onSubmit={handleLogin}>
                    <select onChange={e => { setUserSelected(Number(e.target.value)) }} >
                        <option selected disabled>Selecione o usuário</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>

                    <button type="submit">Entrar</button>
                </form>
            </div>
        </div>
    )
}
import { useContext } from 'react';
import { GeneralContext } from '../../contexts/general';

import { Link } from 'react-router-dom';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { AiOutlineAlert, AiOutlinePoweroff, AiOutlineCheckCircle } from 'react-icons/ai';

import { Header } from '../../components/Header';

import styles from './styles.module.scss';

interface Assets {
    companyId: number;
    healthscore: number;
    id: number;
    image: string;
    metrics: {
        totalCollectsUptime: number;
        totalUptime: number;
        lastUpTime: string;
    }
    model: string;
    name: string;
    sensors: [string];
    specifications: {
        power: number;
        maxTemp: number;
        rpm: number;
    }
    status: string;
    unitId: number;

}

interface Context{
    assets: Assets[];
}

export default function LandingPage() {

    const {assets} = useContext(GeneralContext) as Context;

    const inAlert = assets.filter(asset => asset.status === 'inAlert').length; //Conta quantos ativos existem em alerta
    const inOperation = assets.filter(asset => asset.status === 'inOperation').length; //Conta quantos ativos existem em operação
    const inDowntime = assets.filter(asset => asset.status === 'inDowntime').length; //Conta quantos ativos existem desligados
    const worries = assets.filter(asset => asset.healthscore < 80); //Faz uma array de ativos com menos de 80% de saúde

    //Configurações do gráfico que mostra resumo dos status dos ativos
    const alertChart = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: 'Status dos ativos',
            align: 'center',
            verticalAlign: 'middle',
            y: 60
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        color: 'white'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                size: '110%'
            }
        },
        series: [{
            type: 'pie',
            name: 'Porcentagem de maquinas nesse estado',
            innerSize: '50%',
            data: [
                { name: 'Em Operação', y: inOperation, color: '#18d217' },
                { name: 'Em Alerta', y: inAlert, color: '#F00' },
                { name: 'Desligada', y: inDowntime, color: '#000' },
            ]
        }]
    }


    return (
        <div className={styles.dashboard}>
            <Header />

            <div className={styles.cards}>
                <div className={styles.dashChart}>
                    <div className={styles.chart}>
                        <HighchartsReact highcharts={Highcharts} options={alertChart} className={styles.chart} />
                    </div>

                    <div className={styles.resume}>
                        <span>
                            <AiOutlineCheckCircle size={20} color="#18d217" />
                            <p style={{ color: '#18d217' }}>{inOperation} em operação</p>
                        </span>

                        <span>
                            <AiOutlineAlert size={20} color="#F00" />
                            <p style={{ color: '#F00' }}>{inAlert} em alerta</p>
                        </span>

                        <span>
                            <AiOutlinePoweroff size={20} color="#000" />
                            <p style={{ color: '#000' }} >{inDowntime} desligadas</p>
                        </span>
                    </div>

                </div>

                <div className={styles.worries}>
                    <div className={styles.worriesDiv}>
                        <h1>Alertas</h1>
                        <div className={styles.cardWorrie}>
                            {worries.map(asset => (
                                <span key={asset.id}>
                                    <AiOutlineAlert color="#FFA500" />
                                    <div>
                                        <h1>Saúde abaixo dos 80%</h1>
                                        <p>Saude do <strong>{asset.name}</strong> em <strong>{asset.healthscore}</strong>%</p>
                                    </div>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <Link className={styles.navButton} to="/assets">Ver todos os ativos</Link>
            </div>
        </div>
    )
}
import { useContext, useState } from "react";
import { GeneralContext } from "../../contexts/general";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { Header } from "../../components/Header";

import styles from './styles.module.scss';

interface Assets {
    companyId: number;
    healthscore: number;
    id: number;
    image: string;
    metrics: {
        totalCollectsUptime: number;
        totalUptime: number;
        lastUptimeAt: string;
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

interface Company{
    id: number;
    name: string;
}

interface Unit{
    id: number;
    name: string;
    companyId: number;
}

interface Context{
    assets: Assets[];
    companySelected: Company;
    companyUnits: Unit[]; 
    translateStatus: (status: string) => void;
}

export default function AssetsPage() {

    const {assets, companySelected, companyUnits, translateStatus} = useContext(GeneralContext) as Context;

    const [unitAssets, setUnitAssets] = useState<Assets[]>([]);

    /*
    Essa função separa os ativos por unidade, para assim poder mostrar os ativos das respectivas
    unidades
    */
    function defineUnitAssets(id: Number){
        const data = assets.filter(asset => asset.unitId === id);
        setUnitAssets(data);
    }

    //Dados para alimentar o gráfico de saúde dos ativos.
    const healthChartData = assets.map(asset => {
        return ({
            name: asset.name,
            y: asset.healthscore,
            color: '#2250BE',
        })
    })

    //Configuração do gráfico de saúde dos ativos
    const healthChart = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Saúde dos Ativos'
        },
        xAxis: {
            type: 'Saúde'
        },
        yAxis: {
            title: {
                text: 'Saúde'
            }

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}%'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },

        series: [
            {
                name: "Saúde",
                colorByPoint: true,
                data: healthChartData,
            }
        ]
    }

    return (
        <div className={styles.assetsPage}>
            <Header />

            <div className={styles.cards}>
                <div className={styles.chartCard}>
                    <div>
                        <HighchartsReact highcharts={Highcharts} options={healthChart} />
                    </div>
                </div>

                <div className={styles.assetCard}>
                    <div className={styles.divSelect}>
                        <h1>Ver ativos</h1>
                        <form>
                            <select disabled>
                                <option value={companySelected?.id} selected disabled>{companySelected?.name}</option>
                            </select>
                            <select onChange={e => defineUnitAssets(Number(e.target.value))}>
                                <option selected disabled>Selecione uma unidade</option>
                                {companyUnits.map(unit => (
                                    <option value={unit.id} key={unit.id}>{unit.name}</option>
                                ))}
                            </select>
                        </form>
                    </div>
                    <div className={styles.divAsset}>
                        {unitAssets ? 
                        (
                            unitAssets.map(asset => (
                                <div key={asset.id} className={styles.asset}>
                                    <img src={asset.image} alt={`Foto do ativo ${asset.name}`} />
                                    <h1>{asset.name}</h1>
                                    <p>{asset.sensors}</p>
                                    <div>
                                        <p><strong>Modelo:</strong> {asset.model}</p>
                                        <p><strong>Saúde:</strong> {asset.healthscore}%</p>
                                        <p><strong>Status:</strong> {translateStatus(asset.status)}</p>
                                        <p><strong>Temperatura máxima:</strong> {asset.specifications.maxTemp}</p>
                                        <p><strong>Rotação:</strong> {asset.specifications.maxTemp}</p>
                                        <p><strong>Potência:</strong> {asset.specifications.power}kWh</p>
                                        <p><strong>Total de coletas ligadas:</strong> {Math.round(asset.metrics.totalCollectsUptime)}</p>
                                        <p><strong>Total de horas ligadas:</strong> {Math.round(asset.metrics.totalUptime)}</p>
                                        <p><strong>Data da ultima coleta:</strong> {new Date(String(asset.metrics.lastUptimeAt)).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        )
                        : 
                        'Selecione uma unidade!'}
                    </div>
                </div>
            </div>
        </div>
    )
}
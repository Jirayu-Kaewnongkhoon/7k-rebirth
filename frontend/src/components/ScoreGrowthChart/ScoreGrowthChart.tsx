import type { SeriesValueFormatter } from '@mui/x-charts/internals';
import { LineChart } from '@mui/x-charts/LineChart';

interface Props<T> {
    loading: boolean;
    dataset: T[];
    getXValue: (item: T) => string | number;
    getYValue: (item: T) => number;
    yFormat?: SeriesValueFormatter<number | null> | undefined
}

function ScoreGrowthChart<T>({
    loading,
    dataset,
    getXValue,
    getYValue,
    yFormat,
}: Props<T>) {
    return (
        <LineChart
            loading={loading}
            height={300}
            xAxis={[{
                data: dataset.map(getXValue),
                scaleType: 'point',
                height: 30,
            }]}
            series={[{
                data: dataset.map(getYValue),
                curve: 'linear',
                showMark: true,
                valueFormatter: yFormat
            }]}
        />
    )
}

export default ScoreGrowthChart
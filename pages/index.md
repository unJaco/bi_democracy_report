# Government Officials Report

```sql df_data
SELECT * FROM df
```

```sql trust
SELECT * FROM ng
```


```sql tust_m_v
SELECT Countries, 'High or moderately high trust' AS Measure, "High or moderately high trust" AS Value, 1 AS OrderCol FROM ng
UNION ALL
SELECT Countries, 'Neutral' AS Measure, "Neutral" AS Value, 2 AS OrderCol FROM ng
UNION ALL
SELECT Countries, 'Low or no trust' AS Measure, "Low or no trust" AS Value, 3 AS OrderCol FROM ng
UNION ALL
SELECT Countries, 'Do not know' AS Measure, "Don't know" AS Value, 4 AS OrderCol FROM ng
ORDER BY OrderCol, Countries;

```

<script>

$: trust_ng_min = Math.min(...grouped_data.filter(item => item.MEASURE === 'TRUST_NG' && item.VALUE !== null).map(item => item.VALUE));
$: trust_ng_max = Math.max(...grouped_data.filter(item => item.MEASURE === 'TRUST_NG' && item.VALUE !== null).map(item => item.VALUE));
$: trust_ng_avg = grouped_data.filter(item => item.MEASURE === 'TRUST_NG' && item.VALUE !== null).reduce((acc, item, _, array) => acc + item.VALUE / array.length, 0);

$: trust_cl_min = Math.min(...grouped_data.filter(item => item.MEASURE === 'TRUST_CL' && item.VALUE !== null).map(item => item.VALUE));
$: trust_cl_max = Math.max(...grouped_data.filter(item => item.MEASURE === 'TRUST_CL' && item.VALUE !== null).map(item => item.VALUE));
$: trust_cl_avg = grouped_data.filter(item => item.MEASURE === 'TRUST_CL' && item.VALUE !== null).reduce((acc, item, _, array) => acc + item.VALUE / array.length, 0);

$: trust_le_min = Math.min(...grouped_data.filter(item => item.MEASURE === 'TRUST_LE' && item.VALUE !== null).map(item => item.VALUE));
$: trust_le_max = Math.max(...grouped_data.filter(item => item.MEASURE === 'TRUST_LE' && item.VALUE !== null).map(item => item.VALUE));
$: trust_le_avg = grouped_data.filter(item => item.MEASURE === 'TRUST_LE' && item.VALUE !== null).reduce((acc, item, _, array) => acc + item.VALUE / array.length, 0);

$: gpt_resp = "Loading explanation"

</script>

This is a report for **government officials** to get better insights into criticial metrics. <br>

The goal is to visualize and report critical metrics in one central place to enable officials to see correlations between them and improve the metrics.

## Trust in National Government

<BarChart 
    data={tust_m_v} 
    x=Countries 
    y=Value
    series=Measure
    sort=false
    colorPalette={
        [
        '#cf0d06',
        '#eb5752',
        '#50bcf2',
        '#b5a6a5',
        ]
    }
    type=stacked100
/>



## Take a look into Correlations

To understand how the _Trust in National Governement_ correlates with other metrices select a metric in the dropdown.

Press the _Explain_ Button to get more details.

```sql col_names
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'df' 
AND column_name not like 'INDEX'
AND column_name not like 'REF_AREA'
AND column_name not like 'TIME_PERIOD'
ORDER BY column_name
```

```sql trust_undefined
SELECT REF_AREA FROM ${df_data}
WHERE TRUST_NG is null
```

<Dropdown
    name=cor_val
    data={col_names}
    value=column_name
/>

<LineChart 
    data={df_data} 
    x=REF_AREA 
    y={inputs.cor_val.value}
    y2='TRUST_NG'
    y2SeriesType=bar
/>

```sql correlation
SELECT 
  (SELECT (TRUST_NG) FROM correlation_df WHERE MEASURE = 'SAT_DEM') AS SAT_DEM,
  (SELECT (TRUST_NG) FROM correlation_df WHERE MEASURE = 'TRUST_CL') AS TRUST_CL,
  (SELECT (TRUST_NG) FROM correlation_df WHERE MEASURE = 'TRUST_LE') AS TRUST_LE,
  (SELECT (TRUST_NG) FROM correlation_df WHERE MEASURE = 'TRUST_NG') AS TRUST_NG,
  (SELECT (TRUST_NG) FROM correlation_df WHERE MEASURE = 'EMPW_PARL') AS EMPW_PARL,
  (SELECT (TRUST_NG) FROM correlation_df WHERE MEASURE = 'EMPW_SMP') AS EMPW_SMP,
  (SELECT (TRUST_NG) FROM correlation_df WHERE MEASURE = 'WBS') AS WBS,
  (SELECT (TRUST_NG) FROM correlation_df WHERE MEASURE = 'PerWBSU5') AS PerWBSU5
```

The correlation between **Trust in National Government** and **{inputs.cor_val.value}** is <Value data={correlation} column={inputs.cor_val.value}/>.<br>


<Details title='Trust in National Government is not identified for:'>

{#each trust_undefined as entry}

- {entry.REF_AREA}

{/each}

</Details>


## Deep Dive
```sql grouped_data
SELECT REF_AREA, 'TRUST_NG' AS MEASURE, TRUST_NG AS VALUE
FROM df 
UNION ALL
SELECT REF_AREA, 'TRUST_CL' AS MEASURE, TRUST_CL AS VALUE
FROM df 
UNION ALL
SELECT REF_AREA, 'TRUST_LE' AS MEASURE, TRUST_LE AS VALUE
FROM df
ORDER BY REF_AREA, MEASURE
```

```sql grouped_country_data
SELECT REF_AREA, MEASURE, VALUE, ${trust_ng_min} AS MIN, ${trust_ng_max} AS MAX, ${trust_ng_avg} AS AVG FROM ${grouped_data} WHERE REF_AREA LIKE '${inputs.ref_val.value}' AND MEASURE LIKE 'TRUST_NG'
UNION ALL
SELECT REF_AREA, MEASURE, VALUE, ${trust_cl_min} AS MIN, ${trust_cl_max} AS MAX, ${trust_cl_avg} AS AVG FROM ${grouped_data} WHERE REF_AREA LIKE '${inputs.ref_val.value}' AND MEASURE LIKE 'TRUST_CL'
UNION ALL
SELECT REF_AREA, MEASURE, VALUE, ${trust_le_min}MIN, ${trust_le_max} AS MAX, ${trust_le_avg} AS AVG FROM ${grouped_data} WHERE REF_AREA LIKE '${inputs.ref_val.value}' AND MEASURE LIKE 'TRUST_LE'
ORDER BY REF_AREA, MEASURE
```

A deep dive into various trust metrices for the country. 
Select the country you want to get an insight for.



<Dropdown
    name=ref_val
    data={df_data}
    value=REF_AREA
/>
<BoxPlot 
    data={grouped_country_data}
    name=MEASURE
    midpoint=VALUE
    intervalTop=MIN
    intervalBottom=MAX
/>

### Set that into perspective

```sql comparison_values
SELECT 
TRUST_NG, ${trust_ng_avg} AS NG_AVG, (TRUST_NG - NG_AVG) AS NG_DELTA, TRUST_CL, ${trust_cl_avg} as CL_AVG, (TRUST_CL - CL_AVG) AS CL_DELTA, TRUST_LE, ${trust_le_avg} as LE_AVG, (TRUST_LE - LE_AVG) AS LE_DELTA FROM df WHERE REF_AREA LIKE '${inputs.ref_val.value}'
```

<BigValue 
  data={comparison_values}
  title='Trust in National Government'
  value=TRUST_NG
  comparison=NG_DELTA
  comparisonTitle="compared to avg"
/>

<BigValue 
  data={comparison_values}
  title='Trust in Courts and legal system'
  value=TRUST_CL
  comparison=CL_DELTA
  comparisonTitle="compared to avg"
/>

<BigValue 
  data={comparison_values}
  title='Trust in legislature'
  value=TRUST_LE
  comparison=LE_DELTA
  comparisonTitle="compared to avg"
/>

<br>
<br>

Do you want a [detailed report]({inputs.ref_val.value})?

All data is from the [OECD DATA Explorer](https://data-explorer.oecd.org). <br>
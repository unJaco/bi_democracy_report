# GOVERMENT REPORT

This is a report for **government officials** to get better insights.

```sql df_data
SELECT * FROM df
```

## Trust in the Governemnt

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
SELECT REF_AREA, MEASURE, VALUE FROM ${grouped_data} WHERE REF_AREA LIKE '${inputs.ref_val.value}'
```

<Dropdown
    name=ref_val
    data={df_data}
    value=REF_AREA
/>

<BarChart 
    data={grouped_country_data} 
    x=REF_AREA
    y=VALUE
    series=MEASURE
    type=grouped
    yMax=100
/>

### Set that into perspective

```sql current_values
SELECT 
    TRUST_NG, 
    TRUST_LE, 
    TRUST_CL,
    (TRUST_NG - CAST(${trust_ng_avg} AS DOUBLE)) AS DELTA_AVG_TRUST_NG 
FROM df 
WHERE REF_AREA LIKE '${inputs.ref_val.value}'
```

<script>

$: trust_ng_min = Math.min(...grouped_data.filter(item => item.MEASURE === 'TRUST_NG' && item.VALUE !== null).map(item => item.VALUE));
$: trust_ng_max = Math.max(...grouped_data.filter(item => item.MEASURE === 'TRUST_NG' && item.VALUE !== null).map(item => item.VALUE));
$: trust_ng_avg = grouped_data.filter(item => item.MEASURE === 'TRUST_NG' && item.VALUE !== null).reduce((acc, item, _, array) => acc + item.VALUE / array.length, 0);

$: gpt_resp = "Loading explanation"


</script>

<BigValue 
  data={current_values}
  title='Trust in National Government'
  value=TRUST_NG
  comparison=DELTA_AVG_TRUST_NG
  comparisonTitle="vs. AVG"
/>

<br>

<LinkButton url={inputs.ref_val.value}>
  More Details
</LinkButton>

<br>

## Correlation Interpreter

```sql col_names
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'df' 
AND column_name not like 'column00'
AND column_name not like 'REF_AREA'
AND column_name not like 'TIME_PERIOD'
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
select TRUST_NG from correlation_df
WHERE MEASURE LIKE '${inputs.cor_val.value}'
```

<Accordion>
    <AccordionItem title='Correlation'>
        The correlation between <b>Trust in National Government</b> and <b>{inputs.cor_val.value}</b> is <Value data={correlation}/>.<br>

    </AccordionItem>
    
</Accordion>

<Details title='Trust in National Government is not identified for:'>

{#each trust_undefined as entry}

- {entry.REF_AREA}

{/each}

</Details>
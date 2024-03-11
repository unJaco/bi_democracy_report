# GOVERMENT REPORT

This is a report for *government* officials to get better insights.

```sql col_names
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'df' 
AND column_name not like 'column00'
AND column_name not like 'REF_AREA'
AND column_name not like 'TIME_PERIOD'
```

```sql trust_wbs_data
SELECT * FROM df
```

```sql trust_wbs_chart
SELECT * FROM ${trust_wbs_data}
```

```sql trust_undefined
SELECT REF_AREA FROM ${trust_wbs_data}
WHERE TRUST_NG is null
```

<Dropdown
    name=cor_val
    data={col_names}
    value=column_name
/>

<LineChart 
    data={trust_wbs_chart} 
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
       The correlation is <Value data={correlation}/> 
    </AccordionItem>
</Accordion>

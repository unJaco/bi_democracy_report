## {params.country}

Here you can see all available data about **{params.country}.**

```sql all_country_data
SELECT 'SAT_DEM' AS Measure, SAT_DEM AS Value FROM df WHERE REF_AREA LIKE '${params.country}'
UNION ALL
SELECT 'TRUST_CL', TRUST_CL FROM df WHERE REF_AREA LIKE '${params.country}'
UNION ALL
SELECT 'TRUST_LE', TRUST_LE FROM df WHERE REF_AREA LIKE '${params.country}'
UNION ALL
SELECT 'TRUST_NG', TRUST_NG FROM df WHERE REF_AREA LIKE '${params.country}'
UNION ALL
SELECT 'EMPW_PARL', EMPW_PARL FROM df WHERE REF_AREA LIKE '${params.country}'
UNION ALL
SELECT 'EMPW_SMP', EMPW_SMP FROM df WHERE REF_AREA LIKE '${params.country}'
UNION ALL
SELECT 'WBS', WBS FROM df WHERE REF_AREA LIKE '${params.country}'
UNION ALL
SELECT 'PerWBSU5', PerWBSU5 FROM df WHERE REF_AREA LIKE '${params.country}';

```

<DataTable data="{all_country_data}" search="true" />
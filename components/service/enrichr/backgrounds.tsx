import * as dict from '@/utils/dict'

export const Disease_backgrounds = [
  {
    name: 'Disease_Signatures_from_GEO_down_2014',
    label: 'Disease Signatures from GEO down',
    termType: 'Disease',
    termRe: /^(?<term>.+) (?<gse>[^ ]+)$/,
  },
  {
    name: 'Disease_Signatures_from_GEO_up_2014',
    label: 'Disease Signatures from GEO up',
    termType: 'Disease',
    termRe: /^(?<term>.+) (?<gse>[^ ]+)$/,
  },
  {
    name: 'GTEx_Aging_Signatures_2021',
    label: 'GTEx Aging Signatures 2021',
    termType: 'Disease',
    termRe: /^GTEx (?<term>.+)$/,
  },
  {
    name: 'Rare_Diseases_GeneRIF_ARCHS4_Predictions',
    label: 'Rare Diseases GeneRIF ARCHS4 Predictions',
    termType: 'Disease',
    termRe: /^(?<term>.+)$/,
  },
  {
    name: 'Rare_Diseases_GeneRIF_Gene_Lists',
    label: 'Rare Diseases GeneRIF Gene Lists',
    termType: 'Disease',
    termRe: /^(?<term>.+)$/,
  },
]

export const Drug_backgrounds = [
  {
    name: 'LINCS_L1000_Chem_Pert_Consensus_Sigs',
    label: 'LINCS L1000 Chem Pert Consensus Sigs',
    termType: 'Drug',
    termRe: /^(?<term>.+) (?<direction>Up|Down)$/,
  },
  {
    name: 'LINCS_L1000_Chem_Pert_up',
    label: 'LINCS L1000 Chem Pert Up',
    termType: 'Drug',
    termRe: /^(?<desc>.+?-(?<term>.+)-(?<concentration>.+?))$/,
  },
  {
    name: 'LINCS_L1000_Chem_Pert_down',
    label: 'LINCS L1000 Chem Pert Down',
    termType: 'Drug',
    termRe: /^(?<desc>.+?-(?<term>.+)-(?<concentration>.+?))$/,
  },
]

export const Pathway_backgrounds = [
  {
    name: 'GO_Biological_Process_2021',
    label: 'GO Biological Process 2021',
    termType: 'BiologicalProcess',
    termRe: /^(?<term>.+)\((?<xref>.+?)\)$/,
  },
  {
    name: 'KEGG_2019_Human',
    label: 'KEGG 2019 Human',
    termType: 'Pathway',
    termRe: /^(?<term>.+)$/,
    extra: {
      organism: 'human',
    },
  },
  {
    name: 'KEGG_2019_Mouse',
    label: 'KEGG 2019 Mouse',

    termType: 'Pathway',
    termRe: /^(?<term>.+)$/,
    extra: {
      organism: 'mouse',
    },
  },
  {
    name: 'KEGG_2021_Human',
    label: 'KEGG 2021 Human',
    termType: 'Pathway',

    termRe: /^(?<term>.+)$/,
    extra: {
      organism: 'human',
    },
  },
  {
    name: 'MSigDB_Hallmark_2020',
    label: 'MSigDB Hallmark 2020',
    termType: 'Pathway',
    termRe: /^(?<term>.+)$/,
  },
  {
    name: 'WikiPathway_2021_Human',
    label: 'WikiPathway 2021 Human',
    termType: 'Pathway',
    termRe: /^(?<term>.+)$/,
    extra: {
      organism: 'human',
    },
  },
  {
    name: 'WikiPathway_2019_Human',
    label: 'WikiPathway 2019 Human',
    termType: 'Pathway',
    termRe: /^(?<term>.+) (?<id>[^ ]+)$/,
    extra: {
      organism: 'human',
    },
  },
  {
    name: 'WikiPathway_2019_Mouse',
    label: 'WikiPathway 2019 Mouse',
    termType: 'Pathway',
    termRe: /^(?<term>.+)$/,
    extra: {
      organism: 'mouse',
    },
  },
]

export const Phenotype_backgrounds = [
  {
    name: 'GWAS_Catalog_2019',
    label: 'GWAS Catalog 2019',

    termType: 'Phenotype',
    termRe: /^(?<term>.+)$/,
    extra: {
      organism: 'human',
    },
  },
  {
    name: 'UK_Biobank_GWAS_v1',
    label: 'UK Biobank GWAS v1',

    termType: 'Phenotype',
    termRe: /^(?<term>.+)$/,
    extra: {
      organism: 'human',
    },
  },
  {
    name: 'ClinVar_2019',
    label: 'ClinVar 2019',
    termType: 'Phenotype',
    termRe: /^(?<term>.+)$/,
    extra: {
      organism: 'human',
    },
  },
  {
    name: 'Human_Phenotype_Ontology',
    label: 'Human Phenotype Ontology',
    termType: 'Phenotype',
    termRe: /^(?<term>.+)$/,
    extra: {
      organism: 'human',
    },
  },
  {
    name: 'MGI_Mammalian_Phenotype_Level_4_2019',
    label: 'MGI Mammalian Phenotype Level 4 2019',
    termType: 'Phenotype',
    termRe: /^(?<term>.+)$/,
    extra: {
      organism: 'mouse',
    },
  },
]

export const Tissue_backgrounds = [
  {
    name: 'GTEx_Tissue_Expression_Up',
    label: 'GTEx Tissue Expression Up',
    termType: 'Tissue',
    termRe: /^(?<sample_id>[^ ]+) (?<term>.+?) (?<gender>[^ ]+) (?<age>[^ ]+ years)$/,
    extra: {
      organism: 'human',
    },
  },
  {
    name: 'GTEx_Tissue_Expression_Down',
    label: 'GTEx Tissue Expression Down',
    termType: 'Tissue',
    termRe: /^(?<sample_id>[^ ]+) (?<term>.+?) (?<gender>[^ ]+) (?<age>[^ ]+ years)$/,
    extra: {
      organism: 'human',
    },
  },
  {
    name: 'ARCHS4_Tissues',
    label: 'ARCHS4 Tissues',
    termType: 'Tissue',
    termRe: /^(?<term>.+)$/,
  },
]

export const TranscriptionFactor_backgrounds = [
  {
    name: 'ChEA_2022',
    label: 'ChEA 2022',
    termType: 'TranscriptionFactor',
    termRe: /^(?<term>[^ ]+?) (?<origin>.+) (?<organism>[^ ]+)$/,
  },
  {
    name: 'ENCODE_TF_ChIP-seq_2015',
    label: 'ENCODE TF ChIP-seq 2015',
    termType: 'TranscriptionFactor',
    termRe: /^(?<term>[^ ]+) (?<origin>.+) (?<organism>[^ ]+)$/,
  },
  {
    name: 'ARCHS4_TFs_Coexp',
    label: 'ARCHS4 TF Co-Expression',
    termType: 'TranscriptionFactor',
    termRe: /^(?<term>[^ ]+) (?<organism>[^ ]+) (?<origin>.+)$/,
  },
  {
    name: 'ENCODE_and_ChEA_Consensus_TFs_from_ChIP-X',
    label: 'ENCODE and ChEA Consensus TFs from ChIP-X',
    termType: 'TranscriptionFactor',
    termRe: /^(?<term>.+) (?<origin>[^ ]+?)$/,
  },
]

export const backgrounds = dict.init([
  ...Disease_backgrounds,
  ...Drug_backgrounds,
  ...Pathway_backgrounds,
  ...Phenotype_backgrounds,
  ...Tissue_backgrounds,
  ...TranscriptionFactor_backgrounds,
].map((value) => ({ key: value.name, value })))

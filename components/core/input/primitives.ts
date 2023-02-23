import useSWRImmutable from 'swr/immutable'
import levenSort from '@/utils/leven-sort'
import { Icon, gene_icon, drug_icon, tissue_icon, pathway_icon, phenotype_icon, disease_icon, glycan_icon } from '@/icons'
import { InternalIdentifiableMetaNode } from '@/spec/metanode'
import fetcher from '@/utils/next-rest-fetcher'

export type Primative = {
  name: string,
  label: string,
  icon?: Icon,
  color?: string,
  extra?: {
    term?: {
      meta?: Partial<InternalIdentifiableMetaNode['meta']>,
      autocomplete?: (search: string) => { items: string[], error?: string }
    },
    set?: {
      meta?: Partial<InternalIdentifiableMetaNode['meta']>,
    },
  }
}

export const Disease = {
  name: 'Disease',
  label: 'Disease',
  icon: [disease_icon],
  color: '#B4F8C8',
  extra: {
    term: {
      meta: {
        example: 'Diabetic Nephropathy',
      },
    },
  },
} as Primative

const pubchemFetcher = (url: string) => fetcher<any>(url).then(({ dictionary_terms: { compound } }) => compound)

function usePubchemDrugSuggestions(search: string) {
  const { data, error } = useSWRImmutable<string[]>(() => search.length >= 3 ? `https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/${encodeURIComponent(search)}` : null, pubchemFetcher)
  const items = data ? levenSort(data, search).slice(0, 10) as string[] : []
  return { items, error }
}

export const Drug = {
  name: 'Drug',
  label: 'Drug',
  icon: [drug_icon],
  color: '#FBE7C6',
  extra: {
    term: {
      meta: {
        example: 'imatinib',
        pagerank: 3,
      },
      autocomplete: usePubchemDrugSuggestions,
    },
    set: {
      meta: {
        example: ['ac1ndss5', 'adoprazine', 'ai-10-49', 'alisporivir', 'almitrine', 'alvocidib', 'am 580', 'amg-9810', 'amuvatinib', 'amuvatinib', 'antimycin a', 'apixaban', 'as-252424', 'avasimibe', 'avatrombopag', 'bp-897', 'brexpiprazole', 'brivanib', 'camostat', 'carboxyamidotriazole', 'cbipes', 'cc-223', 'cetylpyridinium chloride', 'chlormidazole', 'ci-1040', 'cloconazole', 'convallatoxin', 'cycloheximide', 'cyclopiazonic acid', 'cypermethrin', 'dapivirine', 'dcpib', 'deguelin', 'digoxigenin', 'dihydromunduletone', 'dihydrorotenone', 'diydroxyflavone', 'drotaverine', 'ethaverine', 'etifoxine', 'fenretinide', 'flunarizine', 'gedunin', 'gitoxigenin diacetate', 'gsk2606414', 'harringtonine', 'hematoporphyrin', 'homoharringtonine', 'imd0354', 'ipag', 'isorotenone', 'jte-013', 'ketoconazole', 'lde225', 'leoidin', 'lgk-974', 'lidoflazine', 'lonafarnib', 'lopinavir', 'loratadine', 'loteprednol etabonate', 'ly2228820', 'mefloquine', 'methylene blue', 'mibampator', 'mk-886', 'mundulone', 'nafamostat', 'nsc319726', 'octenidine', 'oxiconazole', 'papaverine', 'pevonedistat', 'pexidartinib', 'pf-670462', 'ph-797804', 'polidocanol', 'posaconazole', 'proscillaridin', 'raf265 derivative', 'ravuconazole', 'regorafenib', 'sb-612111', 'silmitasertib', 'sorafenib', 'stf-62247', 'strophanthidin', 'strophanthidinic acid', 'thapsigargin', 'thimerosal', 'thioguanosine', 'tioguanine', 'torin 1', 'torin 2', 'tyrphostin', 'vatalanib', 'vlx600', 'voxtalisib', 'vu 0155069', 'way-600', 'zk-93423'],
      },
    },
  },
} as Primative

function useHarmonizomeGeneSuggestions(search: string) {
  const { data, error } = useSWRImmutable<string[]>(() => search.length >= 2 ? `https://maayanlab.cloud/Harmonizome/api/1.0/suggest?t=gene&q=${encodeURIComponent(search)}` : null, fetcher)
  const items = data ? levenSort(data, search).slice(0, 10) as string[] : []
  return { items, error }
}

export const Gene = {
  name: 'Gene',
  label: 'Gene',
  icon: [gene_icon],
  color: '#B3CFFF',
  extra: {
    term: {
      meta: {
        example: 'ACE2',
        pagerank: 7,
      },
      autocomplete: useHarmonizomeGeneSuggestions,
    },
    set: {
      meta: {
        example: ['UTP14A', 'S100A6', 'SCAND1', 'RRP12', 'CIAPIN1', 'ADH5', 'MTERF3', 'SPR', 'CHMP4A', 'UFM1', 'VAT1', 'HACD3', 'RFC5', 'COTL1', 'NPRL2', 'TRIB3', 'PCCB', 'TLE1', 'CD58', 'BACE2', 'KDM3A', 'TARBP1', 'RNH1', 'CHAC1', 'MBNL2', 'VDAC1', 'TES', 'OXA1L', 'NOP56', 'HAT1', 'CPNE3', 'DNMT1', 'ARHGAP1', 'VPS28', 'EIF2S2', 'BAG3', 'CDCA4', 'NPDC1', 'RPS6KA1', 'FIS1', 'SYPL1', 'SARS', 'CDC45', 'CANT1', 'HERPUD1', 'SORBS3', 'MRPS2', 'TOR1A', 'TNIP1', 'SLC25A46', 'MAL', 'EPCAM', 'HDAC6', 'CAPN1', 'TNRC6B', 'PKD1', 'RRS1', 'HP', 'ANO10', 'CEP170B', 'IDE', 'DENND2D', 'CAMK2B', 'ZNF358', 'RPP38', 'MRPL19', 'NUCB2', 'GNAI1', 'LSR', 'ADGRE2', 'PKMYT1', 'CDK5R1', 'ABL1', 'PILRB', 'AXIN1', 'FBXL8', 'MCF2L', 'DBNDD1', 'IGHMBP2', 'WIPF2', 'WFS1', 'OGFOD2', 'MAPK1IP1L', 'COL11A1', 'REG3A', 'SERPINA1', 'MYCBP2', 'PIGK', 'TCAP', 'CRADD', 'ELK1', 'DNAJB2', 'ZBTB16', 'DAZAP1', 'MAPKAPK2', 'EDRF1', 'CRIP1', 'UCP3', 'AGR2', 'P4HA2',],
        pagerank: 6,
      }
    },
  },
} as Primative

export const Metabolite = {
  name: 'Metabolite',
  label: 'Metabolite',
  icon: [drug_icon],
  color: '#A0E7E5',
  extra: {
    term: {
      meta: {
        example: 'Glucose',
      },
    },
  },
} as Primative

// function useGlytoucanSuggestions() {}

export const Glycan = {
  name: 'Glycan',
  label: 'Glycan',
  icon: [glycan_icon],
  color: '#3477b3',
  // examples: {
  //  term: 'G17689DH',
  //  set: ['G49108TO' ,'G57321FI' ,'G78059CC' ,'G55220VL' ,'G36191CD' ,'G80966KZ' ,'G84467IZ' ,'G17689DH' ,'G86357DX' ,'G29857RC' ,'G56749GV' ,'G25520XG' ,'G63889NK' ,'G94531EZ' ,'G91365ZQ' ,'G80858MF' ,'G45495MK' ,'G77252PU' ,'G91413ZX' ,'G45359RY' ,'G11041DA' ,'G60230HH' ,'G30159WR' ,'G82348BZ' ,'G57818FI' ,'G08146BT' ,'G18938DW' ,'G53752TA' ,'G79809MM' ,'G96921ZU' ,'G22140GZ' ,'G58667NI' ,'G27919IH' ,'G74859XI' ,'G27844UM' ,'G39213VZ' ,'G16828VN' ,'G14047PA' ,'G22768VO' ,'G42358LZ' ,'G50489VC' ,'G86753CK' ,'G86696LV' ,'G45209NR']
  //},
  //TODO:
  // autocomplete: {
  //   term: useGlytoucanSuggestions,
  // },
} as Primative

export const Pathway = {
  name: 'Pathway',
  label: 'Pathway or Biological Process',
  icon: [pathway_icon],
  color: '#FFAEBC',
} as Primative

export const Phenotype = {
  name: 'Phenotype',
  label: 'Phenotype',
  icon: [phenotype_icon],
  color: '#FCB5AC',
} as Primative

export const Tissue = {
  name: 'Tissue',
  label: 'Tissue',
  icon: [tissue_icon],
  color: '#98D7C2',
  extra: {
    term: {
      meta: {
        example: 'Brain',
      },
    },
  },
} as Primative

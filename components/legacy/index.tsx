import { MetaNode } from '@/spec/metanode'
import { GeneTerm, VariantTerm } from '@/components/core/term'
import { z } from 'zod'
import { gene_icon, mygeneinfo_icon } from '@/icons'
import * as array from '@/utils/array'
import { z_maybe_array } from '@/utils/zod'
import { resolveVariantCaID, getMyVarintInfoLink, variantIdResolveErrorMessage, alleleRegRespErrorMessage } from '@/components/service/variantinfo/variantUtils'
import { getAlleleRegistryVariantInfo } from '@/components/service/variantinfo/variantInfoSources/alleleRegistryVariantInfo'
import { getVariantInfoFromMyVariantInfo } from '@/components/service/variantinfo/variantInfoSources/myVariantInfo'

export const MyVariantInfoC = z.object({
  _id: z.string(),
  dbsnp: z.object({
    gene: z.object({
      // geneid: z.number().optional(),
      symbol: z.string().optional(),
    }).optional(),
  }).optional(),
  clinvar: z.object({
    // variant_id: z.number().optional(),
    gene: z.object({
      // id: z.string().optional(),
      symbol: z.string().optional(),
    }),
    // rcv: z_maybe_array(z.object({
    //   accession: z.string().optional(),
    //   clinical_significance: z.string().optional(),
    //   conditions: z.object({
    //     name: z.string().optional(),
    //   }).optional(),
    // })).optional(),
  }).optional(),
  snpeff: z.object({
    ann: z_maybe_array(z.object({
      // gene_id: z.string().optional(),
      genename: z.string().optional(),
    })).optional(),
  }).optional(),
})

export type MyVariantInfo = z.infer<typeof MyVariantInfoC>

async function myvariantinfo(variantId: string): Promise<MyVariantInfo> {
  const req = await fetch(`https://myvariant.info/v1/variant/${encodeURIComponent(variantId)}`)
  return await req.json()
}

export const GeneTermFromVariantTerm = MetaNode('GeneTermFromVariantTerm')
  .meta({
    label: 'Identify Closest Gene to Variant (Legacy)',
    description: 'Identify the closest gene to this variant',
    icon: [mygeneinfo_icon],
    hidden: true,
  })
  .inputs({ variant: VariantTerm })
  .output(GeneTerm)
  .resolve(async (props) => {
    const info = MyVariantInfoC.parse(await myvariantinfo(props.inputs.variant))
    let gene: string | undefined
    if (gene === undefined && info.dbsnp !== undefined) gene = array.ensureArray(info.dbsnp)[0].gene?.symbol
    if (gene === undefined && info.clinvar !== undefined) gene = array.ensureArray(info.clinvar)[0].gene?.symbol
    if (gene === undefined && info.snpeff?.ann !== undefined) gene = array.ensureArray(info.snpeff.ann)[0].genename
    if (gene === undefined) throw new Error('Gene not identified in MyVariantInfo')
    return gene
  })
  .story(props => ({ abstract: `The closest gene to the variant was found using MyVariant.info\\ref{doi:10.1093/bioinformatics/btac017}.` }))
  .build()

export const MyVariantInfo = MetaNode('MyVariantInfo')
  .meta({
    label: 'Variant Information',
    description: 'A Variant resolved with MyVariantInfo',
    icon: [gene_icon],
  })
  .codec(MyVariantInfoC)
  .view(variantinfo => (
    <div className="prose max-w-none">
      {variantinfo._id}
    </div>
  ))
  .build()

  export const VariantInfoFromVariantTermMyVarintInfo = MetaNode('VariantInfoFromVariantTermMyVarintInfo')
  .meta({
    label: 'Resolve Variant Info from Term (MyVarintInfo)',
    description: 'Resolve variant info from variant term using the MyVarintInfo API.',
    hidden: true
  })
  .inputs({ variant: VariantTerm })
  .output(MyVariantInfo)
  .resolve(async (props) => {
    var varCaId = await resolveVariantCaID(props.inputs.variant);
    if(varCaId == null || varCaId == ''){
      throw new Error(variantIdResolveErrorMessage);
    }

    const alleleRegResponse = await getAlleleRegistryVariantInfo(varCaId);
    if(alleleRegResponse == null){
      throw new Error(alleleRegRespErrorMessage);
    }

    let myVariantInfoURL = getMyVarintInfoLink(alleleRegResponse);

    if(myVariantInfoURL != null){
      return await getVariantInfoFromMyVariantInfo(myVariantInfoURL);
    }else{
      throw new Error("Unable to find requested data, missing MyVarintInfo API link in External resources!");
    }
  })
  .story(props => ({}))
  .build()

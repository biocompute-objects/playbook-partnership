import React from 'react'
import { MetaNode } from '@/spec/metanode'
import { GeneInfo } from '../service/mygeneinfo'
import { GlycanTerm } from '@/components/core/input/term'
import { z } from 'zod'
import { Gene } from '../core/input/primitives'

export const GlyGenResponse = z.object({
  queryinfo: z.object({
    query: z.object({
      recommended_gene_name: z.string()
    }),
  }),
  results: z.array(z.object({
    uniprot_canonical_ac: z.string()
  }))
})

export type GlyGenResponseType = z.infer<typeof GlyGenResponse>

export const GlyGenResponseNode = MetaNode.createData('GlyGenResponse')
  .meta({
    label: 'GlyGen Response',
    description: 'GlyGen response object',
  })
  .codec(GlyGenResponse)
  .view(data => (
    <div>
      Query:
      <pre >
        {JSON.stringify(data.queryinfo.query, undefined, 2)}
      </pre>
      Results:
      {data.results.map((result, index) => (
        <div key={index}>
          {JSON.stringify(result.uniprot_canonical_ac, undefined, 2)}
        </div>
      ))}
    </div>
  ))
  .build()

export const ProteinProductInformation = MetaNode.createProcess('ProteinProductInformation')
  .meta({
    label: 'Protein Product Information',
    description: 'Search for protein records in GlyGen',
  })
  .inputs({ gene: GeneInfo })
  .output(GlyGenResponseNode)
  .resolve(async (props) => {
    const query = encodeURIComponent(JSON.stringify({
      recommended_gene_name: props.inputs.gene.symbol,
    }))
    const request = await fetch(`https://api.glygen.org/directsearch/protein/?query=${query}`, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
      })
    const response = GlyGenResponse.parse(await request.json())
    return response
  })
  .build()

export const GlycanResponse = z.object({
  glytoucan: z.object({
    glytoucan_ac:z.string(),
    glytoucan_url: z.string()
  }),
  species: z.array(z.object({
    common_name: z.string(),
    name: z.string(),
    taxid: z.number(),
    annotation_category: z.string()
  })),
  enzyme: z.array(z.object({
    uniprot_canonical_ac: z.string(),
    gene_link: z.string(),
    protein_name: z.string(),
    gene: z.string(),
    tax_name: z.string(),

  }))

})

export const GlycanResponseNode = MetaNode.createData('GlycanResponseNode')
  .meta({
    label: 'Glycan Response',
    description: 'Glycan response object'
  })
  .codec(GlycanResponse)
  .view(data => (
    <div>
      <div>Glycan information from Glytoucan:
        <a href={data.glytoucan.glytoucan_url} target='_blank'> {data.glytoucan.glytoucan_ac} </a>
      </div><br/>
      {data.species.map((species, species_index)=> (
        <div key={species_index}>
          Species: {species.name}<br/>
          Common name: {species.common_name}<br/>
          Tax Id: {species.taxid}<br/>
          Annotation category: {species.annotation_category}<br/>
          <div>Enzyme info:</div>
          {data.enzyme.map((enzyme, enzyme_index)=>(
            (enzyme.tax_name === species.name)
              ? <div>&nbsp;&nbsp;&nbsp;&nbsp;
                  <a href={enzyme.gene_link} target='_blank'>Gene: {enzyme.gene}</a><br/>&nbsp;&nbsp;&nbsp;&nbsp;
                  Protein name: {enzyme.protein_name}<br/>&nbsp;&nbsp;&nbsp;&nbsp;
                  Uniprot Canonical Accession: {enzyme.uniprot_canonical_ac}<br/>&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            : <div></div>
          ))}
        </div>)
      )}
    </div>
  ))
  .build()

  export const GlycanInformation = MetaNode.createProcess('GlycanInformation')
    .meta({
      label: 'Glycan information',
      description: 'Search for a glycan in GlyGen with the Glytoucan accession'
    })
    .codec()
    .inputs({ glycan: GlycanTerm })
    .output(GlycanResponseNode)
    .resolve(async (props) => {
      const query = encodeURIComponent(props.inputs.glycan)
      const request = await fetch(`https://api.glygen.org/glycan/detail/${query}`, {
        method: 'GET',
        headers: {accept: 'application/json'}
        })
      const response = await request.json()
      return response
    })
    .build()
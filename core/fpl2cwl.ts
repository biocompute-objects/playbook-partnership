/**
 * This converts PWB workflows and components into CWL workflows, arguments & CommandLineTool specifications.
 */
import type { ProcessMetaNode } from "@/spec/metanode";
import type { FPL } from "@/core/FPPRG"
import type KRG from "@/core/KRG"
import * as array from '@/utils/array'
import * as dict from '@/utils/dict'
import packageJson from '@/package.json'

const docker_tag = 'maayanlab/playbook-partnership'
const version = packageJson.version

export function cwl_cli_for_component(component: ProcessMetaNode) {
  return {
    cwlVersion: 'v1.0',
    class: 'CommandLineTool',
    baseCommand: `pwb ${component.spec}`,
    requirements: [
      {
        class: 'DockerRequirement',
        dockerImageId: `${docker_tag}:${version}`,
      },
    ],
    inputs: {
      ...('codec' in component ? {
        data: {
          type: 'File',
          inputBinding: {
            prefix: `--data=`,
            separate: false,
          },
        },
      } : {}),
      ...dict.init(dict.items(component.inputs).map(({ key, value }) => ({
        key, value: {
          type: Array.isArray(value) ? 'File[]' : 'File',
          inputBinding: {
            prefix: `--inputs.${key}=`,
            separate: false,
          },
        },
      }))),
      output: {
        type: 'string',
        default: 'output.json',
        inputBinding: {
          prefix: `--output=`,
          separate: false,
        },
      },
    },
    outputs: {
      output: {
        type: 'File',
        outputBinding: {
          glob: '$(inputs.output)',
        },
      },
    },
  }
}

export async function cwl_for_playbook(props: { krg: KRG, fpl: FPL }) {
  const fullFPL = props.fpl.resolve()
  const processLookup = dict.init(
    await Promise.all(fullFPL.map(async (step, index) => {
      const metanode = props.krg.getProcessNode(step.process.type)
      return {
        key: step.process.id,
        value: {
          index,
          node: step.process,
          metanode,
        },
      }
    }))
  )
  return {
    ...dict.init(array.unique(dict.values(processLookup).map(({ metanode }) => metanode)).map(metanode => ({
      key: `${metanode.spec}.cwl`,
      value: cwl_cli_for_component(metanode),
    }))),
    'workflow.cwl': {
      cwlVersion: 'v1.2',
      class: 'Workflow',
      requirements: {},
      inputs: dict.init(dict.values(processLookup).filter(({ metanode }) => 'codec' in metanode).map(({ index, node, metanode }) => ({
        key: `step-${index+1}-data`,
        value: {
          type: 'File',
        },
      }))),
      outputs: dict.init(dict.values(processLookup).map(({ index, node, metanode }) => ({
        key: `step-${index+1}-output`,
        value: {
          type: 'File',
          outputSource: `step-${index+1}/output.json`,
        },
      }))),
      steps: dict.init(dict.values(processLookup).map(({ index, node, metanode }) => ({
        key: `${index+1}_${metanode.meta.label}-`, value: {
          run: `${metanode.spec}.cwl`,
          in: dict.init(dict.items(node.inputs).map(({ key, value }) => ({ key, value: processLookup[value.id] })).map(({ key, value }) => ({
            key, value: {
              source: `step-${value.index+1}/output.json`,
            },
          }))),
          out: ['output.json'],
        },
      }))),
    },
    'inputs.yaml': dict.init(await Promise.all(dict.values(processLookup).filter(({ metanode }) => 'codec' in metanode).map(async ({ index, node, metanode }) => ({
      key: `step-${index+1}-data`,
      value: {
        class: 'File',
        contents: JSON.stringify((await node.output())?.value ?? null),
      },
    }))))
  }
}

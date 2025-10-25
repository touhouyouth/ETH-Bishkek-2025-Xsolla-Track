import fs from 'fs'
import contracts from './contracts.json' assert { type: 'json' }

const inputObject = {
  ...contracts,
}

const deploymentsConfig = {}
const contractsConfig = []

for (const chainIdStr in inputObject) {
  const chainId = parseInt(chainIdStr, 0)
  const contracts = inputObject[chainIdStr][process.env.VITE_PROD === 'true'? 1 : 0]?.contracts

  if (!contracts) {
    console.log(`No contracts found for chainId ${chainId}`)
    continue
  }

  for (const contractName in contracts) {
    if (!deploymentsConfig[contractName]) {
      deploymentsConfig[contractName] = {}
    }

    let contractIndex = contractsConfig.findIndex((c) => c.name === contractName)

    if (contractIndex === -1) {
      contractsConfig.push({
        name: contractName,
        abi: contracts[contractName].abi,
        address: {},
      })
      contractIndex = contractsConfig.length - 1
    }

    if (!Object.keys(contracts).length) continue

    contractsConfig[contractIndex].address[chainId] = contracts[contractName].address
  }
}

/**
 * @description Need if we have proxy contracts like AnyIDO, AnyIDO_Proxy, AnyIDO_Implementation, we just create only AnyIDO with proxy address and implementation abi
 * @requires contract Need base contract, AnyIDO, for example, just only [AnyIDO_Proxy, AnyIDO_Implementation] without AnyIDO won't work
 *  */
const noProxyContractsConfig = []
for (let contract of contractsConfig) {
  if (contract.name.includes('_Proxy') || contract.name.includes('_Implementation')) {
    //if base contract exist
    continue
  }

  const proxy = contractsConfig.find((item) => item.name === contract.name + '_Proxy')
  const logic = contractsConfig.find(
    (item) => item.name === contract.name + '_Implementation',
  )

  if (!proxy && !logic) {
    noProxyContractsConfig.push(contract)
    continue
  }

  //For when we have [AnyIDO, AnyIDOProxy] or [AnyIDO, AnyIDOImplementation]
  else if (!proxy && logic) {
    noProxyContractsConfig.push({
      abi: logic.abi,
      name: contract.name,
      address: contract.address,
    })
    continue
  } else if (proxy && !logic) {
    noProxyContractsConfig.push({
      abi: contract.abi,
      name: contract.name,
      address: proxy.address,
    })
    continue
  }

  noProxyContractsConfig.push({
    abi: logic.abi,
    name: contract.name,
    address: proxy.address,
  })
}

// Convert the formatted object to a TypeScript export statement
const formattedContractsConfig = `export const contractsConfig = ${JSON.stringify(
  noProxyContractsConfig,
  null,
  2,
)}`

// Specify the file path
const contractsPath = 'src/.contracts/_contracts.ts'

// Write the TypeScript export statement to the file
// fs.writeFileSync(deploymentsPath, formattedDeploymentsConfig, "utf-8");
fs.writeFileSync(contractsPath, formattedContractsConfig, 'utf-8')

console.log('Contracts ready')

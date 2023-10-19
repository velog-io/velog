const getEnvironment = () => {
  const args = process.argv.slice(2)
  const eFlagIndex = args.indexOf('-e')

  const flag = { environment: '' }
  if (eFlagIndex !== -1) {
    const environment = args[eFlagIndex + 1]
    Object.assign(flag, { environment })
  }
  return flag
}

const main = () => {
  const { environment: eFlag } = getEnvironment()

  const whiteList = ['development', 'stage', 'production']
  if (!whiteList.includes(eFlag)) {
    console.log('Not allowed environment')
    process.exit(1)
  }

  if (eFlag === 'development') {
  } else {
  }
}

main()

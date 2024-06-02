const loadInquirer = async () => {
  const inquirer = await import('inquirer')
  return inquirer.default || inquirer
}

export default loadInquirer

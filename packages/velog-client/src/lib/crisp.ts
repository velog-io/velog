export function setCrispUser({ email, nickname, avatar }: SetCrispUserParams) {
  const w = window as any
  if (!w.$crisp) {
    w.$crisp = []
  }
  const crispArray: any[] = w.$crisp
  crispArray.push(['set', 'user:email', email])
  crispArray.push(['set', 'user:nickname', nickname])
  if (avatar) {
    crispArray.push(['set', 'user:avatar', avatar])
  }
}

type SetCrispUserParams = {
  email: string
  nickname: string
  avatar: string | null
}

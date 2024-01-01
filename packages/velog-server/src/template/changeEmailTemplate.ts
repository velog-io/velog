import { ENV } from '@env'

export const changeEmailTemplate: ChangeEmailTemplateArgs = (username, email, code) => {
  const text = email ? '변경' : '설정'
  const subject = `Velog 이메일 ${text}하기`
  const endpoint = ENV.clientV2Host
  const body = `
  <div class="wrapper" style="max-width: 400px; margin: 0 auto;">
  <a href="https://velog.io">
    <img src="https://images.velog.io/email-logo.png" style="display: block; width: 128px; margin: 0 auto;"/>
  </a>
  <div style="max-width: 100%; width: 400px; margin: 0 auto; padding: 1rem; text-align: justify; background: #f8f9fa; border: 1px solid #dee2e6; box-sizing: border-box; border-radius: 4px; color: #868e96; margin-top: 0.5rem; box-sizing: border-box;">
    <b style="black">안녕하세요!</b>
    ${username}의 이메일을 ${email}로 ${text}하는 것을 승인하겠습니까?
  </div>
  <a href="${endpoint}/email-change?code=${code}" style="text-decoration: none; width: 400px; text-align:center; display:block; margin: 0 auto; margin-top: 1rem; background: #845ef7; padding-top: 1rem; color: white; font-size: 1.25rem; padding-bottom: 1rem; font-weight: 600; border-radius: 4px;">
    ${text}하기
  </a>
  <div style="text-align: center; margin-top: 1rem; color: #868e96; font-size: 0.85rem;">
  <div>위 버튼을 클릭하시거나, 다음 링크를 열으세요:<br/>
      <a style="color: #b197fc;" href="${endpoint}/email-change?code=${code}">${endpoint}/email-change?code=${code}</a>
    </div>
    <br/>
    <div>이 링크는 30분동안 유효합니다.</div>
  </div>
</div>
  `
  return {
    subject,
    body,
  }
}

type ChangeEmailTemplateArgs = (
  usrename: string,
  email: string,
  code: string,
) => { subject: string; body: string }

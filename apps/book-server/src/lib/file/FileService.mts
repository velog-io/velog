import { injectable, singleton } from 'tsyringe'

interface Service {
  generateUploadPath(parmeter: GenerateUploadPathArgs): string
}

@injectable()
@singleton()
export class FileService implements Service {
  public generateUploadPath = ({ id, type, username }: GenerateUploadPathArgs) => {
    return `images/${username}/${type}/${id}`
  }
}

type GenerateUploadPathArgs = {
  id: string
  type: string
  username: string
}



export class GenerateImageName{

    generateRandomName(length:number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    frenameFile(fileName:any) {
        // Divida o nome do arquivo pelo último ponto para obter a extensão
        const dotIndex = fileName.lastIndexOf('.');
        if (dotIndex === -1) {
          throw new Error('Invalid file name');
        }
      
        // Extraia a extensão do arquivo
        const extension = fileName.substring(dotIndex);
        
        // Gere um novo nome aleatório (por exemplo, 10 caracteres de comprimento)
        const newName = this.generateRandomName(10);
        
        // Retorne o novo nome do arquivo com a extensão original
        return newName + extension;
      }

}


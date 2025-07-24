describe("Central de Atendimento ao Cliente TAT", () => {
  //
  beforeEach(() => {
    cy.visit("../../src/index.html");
  });
  it("verifica o título da aplicação", () => {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });
  it("preenche os campos obrigatórios e envia o formulário", () => {
    cy.clock(); //congela o tempo
    cy.get('input[name="firstName"]').type("Gabriel");
    cy.get('input[name="lastName"]').type("Brunetto");
    cy.get('input[type="email"]').type("gabibq@yahoo.com.br");
    cy.get('textarea[name="open-text-area"]').type("Testando...", {
      delay: 200,
    }); //o padrão é 10ms
    cy.contains("button", "Enviar").click();
    cy.get(".success").should("be.visible");

    cy.tick(3000); //avança o tempo em 3 segundos
    cy.get(".success").should("not.be.visible");
  });
  it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
    cy.clock();
    cy.get('input[name="firstName"]').type("Gabriel");
    cy.get('input[name="lastName"]').type("Brunetto");
    cy.get('input[type="email"]').type("gabibq@yahoo,om.br");
    cy.get('textarea[name="open-text-area"]').type("Testando..."); //o padrão é 10ms
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(3000);
    cy.get(".error").should("not.be.visible");
  });
  it("campo de telefone continua vazio quando preenchido com valor não numérico", () => {
    cy.get("#phone").type("abcdefg").should("have.value", "");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.clock();
    cy.get('input[name="firstName"]').type("Gabriel");
    cy.get('input[name="lastName"]').type("Brunetto");
    cy.get('input[type="email"]').type("gabibq@yahoo.com.br");
    cy.get('textarea[name="open-text-area"]').type("Testando..."); //o padrão é 10ms
    cy.get("#phone-checkbox").check();
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(3000);
    cy.get(".error").should("not.be.visible");
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    cy.get('input[name="firstName"]')
      .type("Gabriel")
      .should("have.value", "Gabriel")
      .clear()
      .should("have.value", "");
    cy.get('input[name="lastName"]')
      .type("Brunetto")
      .should("have.value", "Brunetto")
      .clear()
      .should("have.value", "");
    cy.get('input[type="email"]')
      .type("gabibq@yahoo.com.br")
      .should("have.value", "gabibq@yahoo.com.br")
      .clear()
      .should("have.value", "");
    cy.get("#phone")
      .type("11999999999")
      .should("have.value", "11999999999")
      .clear()
      .should("have.value", "");
  });

  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
    cy.clock();
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(3000);
    cy.get(".error").should("not.be.visible");
  });
  it("envia o formuário com sucesso usando um comando customizado", () => {
    cy.clock();
    // const data = {
    //   firstName: 'Fernanda',
    //   lastName: 'Brunetto',
    //   email: 'gabibq@yahoo.com.br',
    //   text: 'Testando...'
    // }
    cy.fillMandatoryFieldsAndSubmit(); //se quiser passar os dados, pode passar como argumento
    // cy.fillMandatoryFieldsAndSubmit(data)
    cy.get(".success").should("be.visible");
    cy.tick(3000);
    cy.get(".success").should("not.be.visible");
  });

  it("seleciona um produto (YouTube) por seu texto", () => {
    cy.get("#product").select("youtube").should("have.value", "youtube");
  });

  it("seleciona um produto (Mentoria) por seu valor (value)", () => {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });

  it("seleciona um produto (Blog) por seu índice", () => {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("be.checked");
  });

  it("marca cada tipo de atendimento", () => {
    cy.get('input[type="radio"]').each((typeOfService) => {
      cy.wrap(typeOfService).check().should("be.checked");
    });
  });

  it("marca ambos checkboxes, depois desmarca o último", () => {
    cy.get('input[type="checkbox"]')
      .check() //esse check marca 1 ou mais checkboxes
      .last()
      .uncheck();
  });

  it("seleciona um arquivo da pasta fixtures", () => {
    cy.get('input[type="file"]')
      .selectFile("cypress/fixtures/example.json")
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo simulando um drag-and-drop", () => {
    cy.get('input[type="file"]')
      .selectFile("cypress/fixtures/example.json", { action: "drag-drop" })
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
    cy.fixture("example.json").as("sampleFile");
    cy.get('input[type="file"]')
      .selectFile("@sampleFile")
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.contains("a", "Política de Privacidade")
      .should("have.attr", "href", "privacy.html")
      .and("have.attr", "target", "_blank");
  });

  Cypress._.times(5, () => {
    it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
      cy.contains("a", "Política de Privacidade")
        .invoke("removeAttr", "target")
        .click();

      cy.contains("h1", "CAC TAT - Política de Privacidade").should(
        "be.visible"
      );
    });
  });

  it("exibe e oculta as mensagens de sucesso e erro usando .invoke()", () => {
    cy.get(".success")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Mensagem enviada com sucesso.")
      .invoke("hide")
      .should("not.be.visible");
    cy.get(".error")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!")
      .invoke("hide")
      .should("not.be.visible");
  });

  it('preenche o campo da área de texto usando o comando invoke', () => {
    cy.get('textarea').invoke('val', 'some-value')
      .should('have.value', 'some-value');
  })

  it('faz uma requisição HTTP', () => {
    cy.request('https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html')
      .as('getRequest')
      .its('status')
      .should('be.equal', 200);
    cy.get('@getRequest')
      .its('statusText')
      .should('be.equal', 'OK');
    cy.get('@getRequest')
      .its('body')
      .should('include', 'CAC TAT');
  })

  it.only('Desafio encontre o gato', () => {
    cy.get("#cat")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "🐈")
      .invoke("hide")
      .should("not.be.visible");
    cy.get('#title')
      .invoke('text', 'CAT TAT')
    cy.get('#subtitle')
      .invoke('text', 'Encontre o gato escondido')
  })
});

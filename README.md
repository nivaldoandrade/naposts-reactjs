<h1 align="center">NA posts</h1>


<p align="center"><a href="https://www.youtube.com/watch?v=4R8S1G7e3-8" target="_blank"><img src="https://img.youtube.com/vi/4R8S1G7e3-8/0.jpg"/></a></p>


O naposts é simples blog integrado com CMS Prismic e seção de comentários com utterances.


## **Configurações Iniciais**

```
  # clonar o repositório
  git clone https://github.com/nivaldoandrade/naposts-reactjs

  # Instalar as dependências dentro da pasta clonada
  yarn

  # Iniciar a aplicação
  yarn start

```
## **Configurações do Prismic**
1. Criar um repositório na [dashboard;](https://prismic.io/dashboard)   
2. Criar um **Custom Types** do tipo **Repeatable Type** com o nome **posts** com a **build mode**:
```
{
  "Main" : {
    "uid" : {
      "type" : "UID",
      "config" : {
        "label" : "slug",
        "placeholder" : "Post UID..."
      }
    },
    "title" : {
      "type" : "Text",
      "config" : {
        "label" : "title",
        "placeholder" : "Título do post..."
      }
    },
    "subtitle" : {
      "type" : "Text",
      "config" : {
        "label" : "subtitle",
        "placeholder" : "Subtítulo do post..."
      }
    },
    "author" : {
      "type" : "Text",
      "config" : {
        "label" : "author",
        "placeholder" : "Nome do autor"
      }
    },
    "banner" : {
      "type" : "Image",
      "config" : {
        "constraint" : { },
        "thumbnails" : [ ],
        "label" : "banner"
      }
    },
    "content" : {
      "type" : "Group",
      "config" : {
        "fields" : {
          "heading" : {
            "type" : "Text",
            "config" : {
              "label" : "heading",
              "placeholder" : "Título da seção..."
            }
          },
          "body" : {
            "type" : "StructuredText",
            "config" : {
              "multi" : "paragraph, strong, em, hyperlink, image, embed, list-item, o-list-item, rtl",
              "allowTargetBlank" : true,
              "label" : "body",
              "placeholder" : "Texto da seção..."
            }
          }
        },
        "label" : "content"
      }
    }
  }
}
```

Criar o arquivo **env.local** na raiz da aplicação:
```
#Prismic
PRISMIC_API_ENDPOINT=
PRISMIC_ACCESS_TOKEN=
```
**Prismic API Endpoint e Gerar token:** [API & Security.](https://spacetraveling-7.prismic.io/settings/apps/)

## **Configurações do Utterances**
Precisa ter um repositório público no github com o Utteranc app instalado. Ele será o responsável por armazernar os comentários;

[Documentação Utteranc.](https://utteranc.es/)

No arquivo **env.local**:

```
##Utterances
NEXT_PUBLIC_UTTERANCES_REPO=nome-do-repositório
```

## Tecnologias

- ReactJS;
- Next.js;
- Typescript;
- Sass;
- Prismic;
- Utteranc;
- React icons;
- Date fns;


**Um pequeno aprendiz nesse grande mundo da programação.** 😃🗺


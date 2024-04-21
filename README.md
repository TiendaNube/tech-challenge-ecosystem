## Links
- [Swagger http://127.0.0.1:8081/docs](http://127.0.0.1:8081/docs)
- [HAProxy loadbalancer status - http://127.0.0.1:8000/monitoring](http://127.0.0.1:8000/monitoring)


## Design Pattern
A arquitetura utilizada no projeto é uma arquitetura baseada em handlers que podem ou não processar determinada requisição dependendo de seu tipo. Esse padrão comportamental é chamado de COR(Chain Of Responsability). Mais em [References](#references)


## References
- Python Interfaces - [Real Python](https://realpython.com/python-interface/)
- Design Patterns - Chain of Responsibility [Refactoring Guru](https://refactoring.guru/design-patterns/chain-of-responsibility)
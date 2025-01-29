<div align = "center">
  <img alt = "project logo" src = "logo.png" />
  <h1>SolutionBuilder</h1>

A recently revived proof of concept for the selfhosted community.

![Maturity Badge](https://img.shields.io/badge/maturity-prototype-red)
[![Discord](https://img.shields.io/discord/846737624960860180?label=Discord%20Server)](https://discord.gg/jhYWWpNJ3v)

</div>

# Screenshots 

Playing around with some ideas. This was a project I developed back in about 2012, and I've recently just added some new apps as it might be useful for people's homelabs. 

![image](https://github.com/user-attachments/assets/66064c0e-bca5-42c8-8d9f-8990c97d0e71)

# Use cases

1. **Visualize your environment** - hardware, clusters, stacks, VMs, Containers, and their relationships, all without having to draw boxes. Click and browse a built-in database of self hosted software.
   1. Future idea: scan your network, or docker.sock, and build the diagram automatically.
   2. Future idea: "Enhance" - zoom in on portions of the diagram to show a single server, or single docker network.
   3. Future idea: easily toggle areas of the diagram, like VLANS, IP Addresses, etc.
   4. Future idea: export as PNG, SVG, etc
     
2. **Annotate the diagram with notes** - add the "why" to the "what". Why are we using Fedora here, or KVM, or Proxmox? Add those notes.

3. **Annotate the diagram with design choices** - eg, for your Load Balancer, did you require OIDC support, and websocket support? Why was HAProxy not an option, etc?
   1. Future idea: Easily browse alternatives for a Load Balancer, that meet your requirements (eg, like a selfhosted AlternativeTo.net). 

4. **Suggest integrations**
   1. Future idea: eg: App A has a plugin for the App B you are using.
   2. Future idea: eg: App A and App B both support OIDC.

5. **Document Lifecylce options**
   1. eg: How is this part of the infrastrucutre backed up?
   2. eg: How is this part of the infrastructure authenticated?
   3. eg: Does this part of the infrastructure rely on an unstable release?

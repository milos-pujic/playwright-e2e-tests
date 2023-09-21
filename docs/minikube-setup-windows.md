# Minikube Setup for Windows

Minikube is one of free alternatives to Docker for Desktop. Minikube and Docker for Desktop are both tools that allow developers to run a local Kubernetes cluster on their own machines. However, there are some key differences between the two tools:

- Docker for Desktop is a full-featured desktop application that includes Docker Engine, Kubernetes, and other tools, while Minikube is a command-line tool that provides a lightweight, single-node Kubernetes cluster.
- Docker for Desktop provides a graphical user interface (GUI) that makes it easy to manage your containers and Kubernetes cluster, while Minikube requires you to use the command line to manage your cluster.
- Docker for Desktop supports both Docker Compose and Kubernetes, while Minikube is focused solely on Kubernetes.
- Docker for Desktop can be used for both local development and production deployments, while Minikube is primarily used for local development and testing.

More information on minikube can be found [here](https://github.com/kubernetes/minikube).

## Clean up Docker for Desktop

This section is only applicable if Docker for Desktop is / was installed on machine. If it isn't / wasn't installed on machine this section can be skipped.

If you have Docker for Desktop installed on your machine, uninstall it before installing minikube.

Uninstall guides for Windows/Mac are available [here](https://docs.docker.com/desktop/uninstall/).

After that, clear the leftover Docker for Desktop data and system components.

1. Open the elevated (as Admin) PowerShell window, type the following command and hit Enter to remove the default networks of Docker.

        Get-HNSNetwork | Remove-HNSNetwork

2. Run the following command to clear the program date of Docker from Windows.

        Remove-Item "C:\ProgramData\Docker" -Recurse

3. Run the following command to reboot your system to execute the uninstallation and cleanup.

        Restart-Computer -Force

## Installation Guide

Official installation guides are available ono minikube's [Get Started!](https://minikube.sigs.k8s.io/docs/start/) page. This guide recommends and shows installation via package managers, for Windows [Chocolatey](https://chocolatey.org/). You can chose any other method mentioned on minikube's [Get Started!](https://minikube.sigs.k8s.io/docs/start/) page, but than you must install other components and configuration on your own.

This guide will cover setup for:

- Package Manager: [Chocolatey](https://chocolatey.org/)
- Virtualization Engine: `Hyper-V`
- Additionally tools and command line interfaces: `Docker CLI` and `Docker Compose`
- Host File and PowerShell Configuration

### Install minikube

1. Enable Hyper-V on Windows with bellow guide:

        1. Press the Windows key + R to open the Run dialog box.
        2. Type appwiz.cpl and press Enter.
        3. In the Programs and Features window, select Turn Windows features on or off in the left-hand pane.
        4. In the Windows Features window, scroll down to Hyper-V and check the box next to it.

      ![Windows Enable HyperV](/docs/imgs/windows-enable-hyperv.png)

        5. Click on OK and wait for the installation process to complete.
        6. Once the installation is complete, click on Restart Now to restart your computer.
2. Open PowerShell with Administrator privileges
3. Install Chocolatey by running the following command:

        Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

4. Install Minikube by running the following command:

        choco install minikube -y

5. Install Docker CLI by running the following command:

        choco install docker-cli -y

6. Install Docker Compose by running the following command:

        choco install docker-compose -y

7. Close and Open Again PowerShell with Administrator privileges

8. Verify the installation by running the following command:

        minikube version

## Start minikube

To start minikube, it is important that on first initial start configuration is passed with configuration flags.

Recommendation is to give minikube half of machines resources, if you have 16GB or RAM, give minikube 8GB of RAM, if you have 8 core CPU, give minikube 4 cores.

To be able to use ports like 80 and 8080 it is needed to extend NodePort range from default range 30000-32767 to 1-65535.

### Initial start of minikube

1. Open PowerShell with administrator privileges
2. Start minikube by running the following command:

        minikube start --addons=dashboard --addons=metrics-server --memory 8192 --cpus 4 --extra-config=apiserver.service-node-port-range=1-65535

      - sometime error can occurs during initial start, in that case stop minikube, purge it and start again with same command:

            minikube stop
            minikube delete --all --purge
            minikube start --addons=dashboard --addons=metrics-server --memory 8192 --cpus 4 --extra-config=apiserver.service-node-port-range=1-65535

---

After minikube is initially started like this, every next start can be just with the command:

    minikube start

When you finish testing / using minikube for the day, do not forget to stop it to conserve machine resources, with command:

    minikube stop

Next time when you start it it will be in same state as when you stopped it.

Minikube configuration can always be checked in `%USERPROFILE%\.minikube\machines\minikube\config.json` file.

## Configure machine to use minikube

To use minikube with ease there are couple of tips and tricks which can help you.

### (optional) Minikube Dashboard

Minikube Dashboard is a web-based Kubernetes user interface. To access the dashboard use following command in Powershell:

    minikube dashboard

This will enable the dashboard add-on, and open the proxy in the default web browser.

### (optional) Visual Studio Code (VS Code) plugins

On both Windows and Mac there are plugins available for VS Code which provide user interface to Minikube's Kubernetes. Plugins which can help control Minikube's Kubernetes are:

- [Docker VS Code Plugin](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
- [Kubernetes VS Code Plugin](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)

Docker VS Code Plugin requires to configure it properly to use minikube's docker. To configure this plugin open its configuration inside of VS Code, and navigate to `Docker: Environment` section. Run following command in Powershell:

    minikube docker-env

That command will output `DOCKER_TLS_VERIFY`, `DOCKER_HOST`, `DOCKER_CERT_PATH` and `MINIKUBE_ACTIVE_DOCKERD` items. Add all 4 items with their values in `Docker: Environment` section.

Kubernetes VS Code Plugin does not require any additional configuration.

After that you can use both of those plugins to control your Kubernetes cluster and docker inside VS Code.

### Configure Windows host file and terminal to use minikube

#### Configure Host File

Add minikube IP address in host file for easier access. Bellow guide will add host record pointing to minikube IP and with domain name `kube.local`.

First, fetch minikube IP address by using bellow command:

    minikube ip

This will output IP address of minikube. After that you can add new host record in Window by following bellow steps:

1. Open Notepad as Administrator

        1. Click on the Windows icon in the taskbar or press the Windows key on your keyboard to open the Start Menu.
        2. Type "Notepad" into the search bar.
        3. Right-click on "Notepad" in the search results.
        4. Select "Run as administrator" from the context menu. This will open Notepad with administrative privileges, which is necessary to edit the host file.

2. Open the Host File

        1. In Notepad, click on "File" in the top-left corner of the window.
        2. Choose "Open" from the menu.
        3. In the "File Name" field of the "Open" dialog, type the following path and press Enter: C:\Windows\System32\drivers\etc\hosts
        This will open the host file located in the specified directory.

3. Add the new Host Entry

        1. The host file should now be open in Notepad. Scroll to the end of the file.
        2. Add the following line to the end of the host file:

        [MINIKUBE_IP_ADDRESS] kube.local
        
        IMPORTANT: Replace [MINIKUBE_IP_ADDRESS] with IP address returned by 'minikube ip. command. Also, make sure there are no leading spaces or tabs in this line.

4. Save the Changes

        1. In Notepad, click on "File" in the top-left corner again.
        2. Choose "Save" from the menu. This will save the changes you made to the host file.

5. Close Notepad
6. Flush DNS Cache

        1. To ensure the changes take effect immediately, open PowerShell with administrative privileges. You can do this by searching for "PowerShell" in the Start Menu, right-clicking on "Windows PowerShell," and selecting "Run as administrator."
        2. In the PowerShell window, run the following command to clear the DNS cache:

        Clear-DnsClientCache

#### Configure Current PowerShell Session

To be able to run docker commands with minikube inside **CURRENT** PowerShell session we need to configure docker-cli to use minikube.

Execute following command:

    minikube docker-env

It will output list of commands which you need to execute, but also, at the end, commented out, there is command which you can execute and it will do it all for you.

For Windows that is following command:

    & minikube -p minikube docker-env --shell powershell | Invoke-Expression

IMPORTANT: If you close and/or open new PowerShell session you will need again to execute above command(s) before you can use docker commands.

## Uninstall minikube and all its dependencies

1. Open PowerShell with administrator privileges
2. Stop minikube by running the following command:

        minikube stop

3. Delete and purge minikube by running the following command:

        minikube delete --all --purge

4. Uninstall Docker Compose by running the following command:

        choco uninstall docker-compose -y --remove-dependencies

5. Uninstall Docker CLI by running the following command:

        choco uninstall docker-cli -y --remove-dependencies

6. Uninstall Minikube by running the following command:

        choco uninstall minikube -y --remove-dependencies

7. Disable Hyper-V on Windows with bellow guide:

        1. Press the Windows key + R to open the Run dialog box.
        2. Type appwiz.cpl and press Enter.
        3. In the Programs and Features window, select Turn Windows features on or off in the left-hand pane.
        4. In the Windows Features window, scroll down to Hyper-V and uncheck the box next to it.

      ![Windows Disabled HyperV](/docs/imgs/windows-disable-hyperv.png)

        5. Click on OK and wait for the uninstallation process to complete.
        6. Once the uninstallation is complete, click on Restart Now to restart your computer.

8. Manually remove Host Entry added in [this step](#configure-host-file).
9. (optional) Uninstall Chocolatey by following guide available [here](https://docs.chocolatey.org/en-us/choco/uninstallation).

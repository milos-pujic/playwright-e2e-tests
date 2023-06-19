[← Back to documentation](/README.md#local-kubernetes-environment-with-minikubes-kubernetes)

# Minikube Setup

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

For Windows:

1. Open the elevated (as Admin) PowerShell window, type the following command and hit Enter to remove the default networks of Docker.

        Get-HNSNetwork | Remove-HNSNetwork

2. Run the following command to clear the program date of Docker from Windows.

        Remove-Item "C:\ProgramData\Docker" -Recurse

3. Run the following command to reboot your system to execute the uninstallation and cleanup.

        Restart-Computer -Force

For MacOS:

Open terminal and execute following commands, one by one, to remove all Docker Desktop dependencies on local file system:

    sudo rm -f /usr/local/bin/docker
    sudo rm -f /usr/local/bin/docker-machine
    sudo rm -f /usr/local/bin/docker-compose
    sudo rm -f /usr/local/bin/docker-credential-desktop
    sudo rm -f /usr/local/bin/docker-credential-ecr-login
    sudo rm -f /usr/local/bin/docker-credential-osxkeychain
    sudo rm -Rf ~/.docker
    sudo rm -Rf ~/Library/Containers/com.docker.docker
    sudo rm -Rf ~/Library/Application\ Support/Docker\ Desktop
    sudo rm -Rf ~/Library/Group\ Containers/group.com.docker
    sudo rm -f ~/Library/HTTPStorages/com.docker.docker.binarycookies
    sudo rm -f /Library/PrivilegedHelperTools/com.docker.vmnetd
    sudo rm -f /Library/LaunchDaemons/com.docker.vmnetd.plist
    sudo rm -Rf ~/Library/Logs/Docker\ Desktop
    sudo rm -Rf /usr/local/lib/docker
    sudo rm -f ~/Library/Preferences/com.docker.docker.plist
    sudo rm -Rf ~/Library/Saved\ Application\ State/com.electron.docker-frontend.savedState
    sudo rm -f ~/Library/Preferences/com.electron.docker-frontend.plist

## Install minikube

Official installation guides are available ono minikube's [Get Started!](https://minikube.sigs.k8s.io/docs/start/) page. This guide recommends and shows installation via package managers, for Windows [Chocolatey](https://chocolatey.org/), for MacOS [Homebrew](https://brew.sh/). You can chose any other method mentioned on minikube's [Get Started!](https://minikube.sigs.k8s.io/docs/start/) page, but than you must install other components and configuration on your own.

This guide will cover installing:

- Package Managers
  - for Windows [Chocolatey](https://chocolatey.org/)
  - for MacOS [Homebrew](https://brew.sh/)
- Virtualization Engine
  - for Windows `Hyper-V`
  - for Mac `HyperKit`
- Additionally needed tools and command line interfaces
  - Docker CLI
  - Docker Build X
- Host File Configuration

### Install minikube on Windows

1. Open PowerShell with administrator privileges
2. Install Chocolatey by running the following command:

        Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

3. Install Hyper-V by running the following command:

        choco install hyper-v -y

4. Install Minikube by running the following command:

        choco install minikube -y

5. Verify the installation by running the following command:

        minikube version

6. Install Docker CLI by running the following command:

        choco install docker-cli -y
  
7. Verify the installation by running the following command:

        docker version

### Install minikube on MacOS

1. Open Terminal
2. Install Homebrew by running the following command:

        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

3. Install HyperKit by running the following command:

        brew install hyperkit

4. Install Minikube by running the following command:

        brew install minikube

5. Verify the installation by running the following command:

        minikube version

6. Install Docker CLI by running the following command:

        brew install docker

7. Install Docker Buildx by running the following command:

        brew install docker-buildx

    - docker-buildx is a Docker plugin. For Docker to find this plugin, symlink it:

          mkdir -p ~/.docker/cli-plugins
          ln -sfn $HOMEBREW_PREFIX/opt/docker-buildx/bin/docker-buildx ~/.docker/cli-plugins/docker-buildx

8. Verify the installation by running the following command:

        docker version

## Start minikube

To start minikube, it is important that on first initial start configuration is passed with configuration flags.

Recommendation is to give minikube half of machines resources, if you have 16GB or RAM, give minikube 8GB of RAM, if you have 8 core CPU, give minikube 4 cores.

To be able to use ports like 80, 8080 which are Restful Booker Platform it is needed to extend NodePort range from default range 30000-32767 to 1-65535.

### Initial start of minikube on Windows

1. Open PowerShell with administrator privileges
2. Start minikube by running the following command:

        minikube start --memory 8192 --cpus 4 --extra-config=apiserver.service-node-port-range=1-65535

      - sometime error can occurs during initial start, in that case stop minikube, purge it and start again with same command:

            minikube stop
            minikube delete --all --purge
            minikube start --memory 8192 --cpus 4 --extra-config=apiserver.service-node-port-range=1-65535

### Initial start of minikube on MacOS

1. Open Terminal
2. Start minikube by running the following command (you will be asked for sudo rights):

        minikube start --memory 8192 --cpus 4 --extra-config=apiserver.service-node-port-range=1-65535

      - sometime error can occurs during initial start, in that case stop minikube, purge it and start again with same command:

            minikube stop
            minikube delete --all --purge
            minikube start --memory 8192 --cpus 4 --extra-config=apiserver.service-node-port-range=1-65535

---

After minikube is initially started like this, every next start can be just with the command:

    minikube start

When you finish testing / using minikube for the day, do not forget to stop it to conserve machine resources, with command:

    minikube stop

Next time when you start it it will be in same state as when you stopped it.

Minikube configuration can always be checked in `~/.minikube/machines/minikube/config.json` file.

## Configure machine to use minikube

To use minikube with ease there are couple of tips and tricks which can help you.

### (optional) Minikube Dashboard

Minikube Dashboard is a web-based Kubernetes user interface. To access the dashboard use following command in Powershell (on Windows) or in Terminal (on MacOS):

    minikube dashboard

This will enable the dashboard add-on, and open the proxy in the default web browser.

### (optional) Visual Studio Code (VS Code) plugins

On both Windows and MacOS there are plugins available for VS Code which provide user interface to Minikube's Kubernetes. Plugins which can help control Minikube's Kubernetes are:

- [Docker VS Code Plugin](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
- [Kubernetes VS Code Plugin](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)

Docker VS Code Plugin requires to configure it properly to use minikube's docker. To configure this plugin open its configuration inside of VS Code, and navigate to `Docker: Environment` section. Run following command in Powershell (on Windows) or in Terminal (on MacOS)

    minikube docker-env

That command will output `DOCKER_TLS_VERIFY`, `DOCKER_HOST`, `DOCKER_CERT_PATH` and `MINIKUBE_ACTIVE_DOCKERD` items. Add all 4 items with their values in `Docker: Environment` section.

Kubernetes VS Code Plugin does not require any additional configuration.

After that you can use both of those plugins to control your Kubernetes cluster and docker inside VS Code.

### Configure Windows machine to use minikube

TBD

### Configure MacOS host file and terminal to use minikube

To be able to run docker commands with minikube inside all terminal sessions we need to configure docker-cli to use minikube. Add following entry to `~/.bashrc` or `~/.zshrc`:

- `eval $(minikube docker-env)`

Add minikube IP address in host file for easier access. Bellow command will add host record pointing to minikube IP and with domain names `kube.local`.

    echo "`minikube ip` kube.local" | sudo tee -a /etc/hosts > /dev/null

## Uninstall minikube

### Uninstall minikube and all its dependencies on Windows

1. Open PowerShell with administrator privileges
2. Stop minikube by running the following command:

        minikube stop

3. Delete and purge minikube by running the following command:

        minikube delete --all --purge

4. Uninstall Hyper-V by running the following command:

        choco uninstall hyper-v -y --remove-dependencies

5. Uninstall Docker CLI by running the following command:

        choco uninstall docker-cli -y --remove-dependencies

6. Uninstall Minikube by running the following command:

        choco uninstall minikube -y --remove-dependencies

### Uninstall minikube and all its dependencies on MacOS

1. Open Terminal
2. Stop minikube by running the following command:

        minikube stop

3. Delete and purge minikube by running the following command:

        minikube delete --all --purge

4. Uninstall Docker Buildx by running the following command:

        brew uninstall docker-buildx

5. Uninstall Docker CLI by running the following command:

        brew uninstall docker

6. Uninstall Minikube by running the following command:

        brew uninstall minikube

7. Uninstall HyperKit by running the following command:

        brew uninstall hyperkit

8. Remove all unused dependencies by running the following command:

        brew autoremove

[← Back to documentation](/readme.md#local-kubernetes-environment-with-minikubes-kubernetes)

# Minikube Setup for Mac

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

## Installation Guide

Official installation guides are available ono minikube's [Get Started!](https://minikube.sigs.k8s.io/docs/start/) page. This guide recommends and shows installation via package managers, for Mac [Homebrew](https://brew.sh/). You can chose any other method mentioned on minikube's [Get Started!](https://minikube.sigs.k8s.io/docs/start/) page, but than you must install other components and configuration on your own.

This guide will cover setup for:

- Package Manager: [Homebrew](https://brew.sh/)
- Virtualization Engine: `HyperKit`
- Additionally tools and command line interfaces:  `Docker CLI`, `Docker Compose` and `Docker Buildx`
- Host File and Terminal Configuration

### Install minikube

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
          ln -sfn /usr/local/opt/docker-buildx/bin/docker-buildx ~/.docker/cli-plugins/docker-buildx

8. Install Docker Compose by running the following command:

        brew install docker-compose

    - Compose is now a Docker plugin. For Docker to find this plugin, symlink it:

          mkdir -p ~/.docker/cli-plugins
          ln -sfn /usr/local/opt/docker-compose/bin/docker-compose ~/.docker/cli-plugins/docker-compose

## Start minikube

To start minikube, it is important that on first initial start configuration is passed with configuration flags.

Recommendation is to give minikube half of machines resources, if you have 16GB or RAM, give minikube 8GB of RAM, if you have 8 core CPU, give minikube 4 cores.

To be able to use ports like 80 and 8080 it is needed to extend NodePort range from default range 30000-32767 to 1-65535.

### Initial start of minikube

1. Open Terminal
2. Start minikube by running the following command (you will be asked for sudo rights):

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

Minikube configuration can always be checked in `~/.minikube/machines/minikube/config.json` file.

## Configure machine to use minikube

To use minikube with ease there are couple of tips and tricks which can help you.

### (optional) Minikube Dashboard

Minikube Dashboard is a web-based Kubernetes user interface. To access the dashboard use following command in Terminal:

    minikube dashboard

This will enable the dashboard add-on, and open the proxy in the default web browser.

### (optional) Visual Studio Code (VS Code) plugins

On both Windows and Mac there are plugins available for VS Code which provide user interface to Minikube's Kubernetes. Plugins which can help control Minikube's Kubernetes are:

- [Docker VS Code Plugin](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
- [Kubernetes VS Code Plugin](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)

Docker VS Code Plugin requires to configure it properly to use minikube's docker. To configure this plugin open its configuration inside of VS Code, and navigate to `Docker: Environment` section. Run following command in in Terminal:

    minikube docker-env

That command will output `DOCKER_TLS_VERIFY`, `DOCKER_HOST`, `DOCKER_CERT_PATH` and `MINIKUBE_ACTIVE_DOCKERD` items. Add all 4 items with their values in `Docker: Environment` section.

Kubernetes VS Code Plugin does not require any additional configuration.

After that you can use both of those plugins to control your Kubernetes cluster and docker inside VS Code.

### Configure Mac host file and terminal to use minikube

#### Configure Host File

Add minikube IP address in host file for easier access. Bellow command will add host record pointing to minikube IP and with domain name `kube.local`.

    echo "`minikube ip` kube.local" | sudo tee -a /etc/hosts > /dev/null

#### Configure Current Terminal Session

If you just want to use docker commands inside current session use this guide, but if you want to use it in all terminal sessions, skip this one and use next [Configure All Terminal Sessions](#configure-all-terminal-sessions) guide.

To be able to run docker commands with minikube inside **CURRENT** terminal session we need to configure docker-cli to use minikube.

Execute following command:

    minikube docker-env

It will output list of commands which you need to execute, but also, at the end, commented out, there is command which you can execute and it will do it all for you.

For Mac that is following command:

    eval $(minikube -p minikube docker-env)

IMPORTANT: If you close and/or open new terminal session you will need again to execute above command(s) before you can use docker commands.

#### Configure All Terminal Sessions

If you just want to use docker commands inside all sessions use this guide, but if you want to use it in current terminal session, skip this one and use previous [Configure Current Terminal Session](#configure-current-terminal-session) guide.

To be able to run docker commands with minikube inside **ALL** terminal sessions we need to configure docker-cli to use minikube. Add following entry to `~/.bashrc` or `~/.zshrc`:

- `eval $(minikube docker-env)`

## Uninstall minikube and all its dependencies

1. Open Terminal
2. Stop minikube by running the following command:

        minikube stop

3. Delete and purge minikube by running the following command:

        minikube delete --all --purge

4. Uninstall Docker Buildx by running the following command:

        brew uninstall docker-buildx

5. Uninstall Docker Compose by running the following command:

        brew uninstall docker-compose

6. Uninstall Docker CLI by running the following command:

        brew uninstall docker

7. Uninstall Minikube by running the following command:

        brew uninstall minikube

8. Uninstall HyperKit by running the following command:

        brew uninstall hyperkit

9. Remove all unused dependencies by running the following command:

        brew autoremove

10. Manually remove Host Entry added [this step](#configure-host-file), easiest way to do that is via nano text editor by using following command:

        sudo nano /etc/hosts

    - Than scroll to the end of the file and remove added host record
    - Save and Close nano text editor

          Control + O
          Control + X

11. If you have used this guide [Configure All Terminal Sessions](#configure-all-terminal-sessions), than manually remove entry from `~/.bashrc` or `~/.zshrc` files
12. (optional) Uninstall Homebrew by running the following command:

        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"

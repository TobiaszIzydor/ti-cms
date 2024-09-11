<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class InstallController extends AbstractController
{
    #[Route('/install', name: 'install')]
    public function index(Request $request): Response
    {
        $form = $this->createFormBuilder()
            ->add('db_user', TextType::class, ['label' => 'Database User'])
            ->add('db_password', TextType::class, ['label' => 'Database Password'])
            ->add('db_host', TextType::class, ['label' => 'Database Host', 'data' => '127.0.0.1'])
            ->add('db_port', TextType::class, ['label' => 'Database Port', 'data' => '3306'])
            ->add('db_name', TextType::class, ['label' => 'Database Name'])
            ->add('save', SubmitType::class, ['label' => 'Install'])
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();

            $envContent = file_get_contents($this->getParameter('kernel.project_dir').'/.env');
            $envContent = str_replace(
                ['db_user', 'db_password', '127.0.0.1', '3306', 'db_name'],
                [$data['db_user'], $data['db_password'], $data['db_host'], $data['db_port'], $data['db_name']],
                $envContent
            );

            file_put_contents($this->getParameter('kernel.project_dir').'/.env', $envContent);

            $this->addFlash('success', 'Configuration saved. Please run "composer install" and "php bin/console doctrine:migrations:migrate".');

            return $this->redirectToRoute('install');
        }

        return $this->render('install/index.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
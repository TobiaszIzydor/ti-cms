<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\Page;
use App\Entity\PageTemplate;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class PageController extends AbstractController
{
    #[Route('/api/save-content/', name: 'save-content', methods: ['POST'])]
    public function saveContent(Request $request, EntityManagerInterface $entityManager)
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['content']) || !isset($data['name'])) {
            return new JsonResponse(['success' => false, 'message' => 'Nieprawidłowa treść.'], 400);
        }

        // Wyszukiwanie strony po nazwie
        $page = $entityManager->getRepository(Page::class)->findOneBy(['name' => $data['name']]);
        if (!$page) {
            return new JsonResponse(['success' => false, 'message' => 'Nie znaleziono strony'], 404);
        }

        // Aktualizacja treści strony
        $page->setContent($data['content']);
        $page->setTemplate($data['style']);
        $entityManager->persist($page);
        $entityManager->flush();

        return new JsonResponse(['success' => true]);
    }
    #[Route('/', name: 'homepage_show')]
    public function index(): Response
    {
        return $this->render('page/index.html.twig', [
        ]);
    }
    #[Route('/edit/{path}', requirements: ['path' => '.*'], name: 'page_edit', priority: 1)]
    public function edit(EntityManagerInterface $entityManager, \Twig\Environment $twig, string $path): Response
    {
        $page = $entityManager->getRepository(Page::class)->findOneBy(['name' => $path]);

        if (!$page) {
            throw $this->createNotFoundException('The page does not exist');
        }
        
        if ($page->getContent() !== null){
            $pageContent = $twig->createTemplate($page->getContent())->render(['page' => $page]);
        }
        else{
            $pageContent = null;
        }

        return $this->render('page/edit.html.twig', [
            'page' => $page,
            'page_content' => $pageContent,
        ]);
    }
    #[Route('/api/get-templates', name: 'get-templates', priority: 1)]
    public function getTemplates(EntityManagerInterface $entityManager)
    {
        $templates = $entityManager->getRepository(PageTemplate::class)->findAll();
        if (!$templates) {
            return new JsonResponse(['error' => 'Template not found'], 404);
        }
        $templateData = [];
        foreach ($templates as $template) {
        $templateData[] = [
            'id' => $template->getId(),
            'name' => $template->getName(),
            'img' => $template->getImg(),
        ];
        }
        return new JsonResponse($templateData);
    }
    #[Route('/api/tipanel_templates', name: 'tipanel_templates', priority: 1)]
    public function listTemplates(EntityManagerInterface $entityManager)
    {
        $templates = $entityManager->getRepository(PageTemplate::class)->findAll();

        return $this->render('page/templates.html.twig', [
            'templates' => $templates,
        ]);

    }
    #[Route('/api/get-template/{attr}', name: 'get-template', priority: 1)]
    public function getTemplate($attr, EntityManagerInterface $entityManager)
    {
        $template = $entityManager->getRepository(PageTemplate::class)->find($attr);
        if (!$template) {
            return new JsonResponse(['error' => 'Template not found'], 404);
        }
        
        $templateData = [
            'id' => $template->getId(),
            'name' => $template->getName(),
            'html' => $template->getCode(),
            'css' => $template->getStyle(),
        ];
        return new JsonResponse($templateData);
    }
    #[Route('/api/page_list', name: 'page_list', priority: 1)]
    public function pageList(EntityManagerInterface $entityManager): Response
    {
        $pages = $entityManager->getRepository(Page::class)->findAll();
        return $this->render('page/list.html.twig', [
            'pages' => $pages,
        ]);
    }
    #[Route('/api/tipanel_add_page/', name: 'tipanel_add_page')]
    public function addPage(Request $request, EntityManagerInterface $entityManager): Response
    {
        $title = $request->query->get('title');
        $route = $request->query->get('route');

        if (!$route && !$title) {
            return new JsonResponse(['success' => false, 'message' => 'Nieprawidłowa treść.'], 400);
        }

        $page = new Page;
        $page->setTitle($title);
        $page->setName($route);
        $page->setAuthor(1);
        $page->setPublicationDate(new \DateTime());
        $page->setModification_Date(new \DateTime());
        $page->setStatus("hidden");

        $entityManager->persist($page);
        $entityManager->flush();
        
        return new JsonResponse(['success' => true]);
    }
    #[Route('/{path}', name: 'page_show', requirements: ['path' => '.*'], priority: -1)]
    public function show(EntityManagerInterface $entityManager, \Twig\Environment $twig, string $path = null): Response
    {
        $page = $entityManager->getRepository(Page::class)->findOneBy(['name' => $path]);

        if (!$page) {
            throw $this->createNotFoundException('The page does not exist');
        }
        if ($page->getContent() !== null){
            $pageContent = $twig->createTemplate($page->getContent())->render(['page' => $page]);
        }
        else{
            $pageContent = null;
        }
        return $this->render('page/show.html.twig', [
            'page' => $page,
            'page_content' => $pageContent,
        ]);
    }
}
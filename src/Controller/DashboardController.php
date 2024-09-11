<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\DashboardService;

class DashboardController extends AbstractController
{
    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }
    #[Route('/ti-panel/{name}', name: 'dashboard_path')]
    public function index(string $name): Response
    {
        return $this->redirectToRoute('dashboard', ['route' => $name]);
    }
    #[Route('/ti-panel', name: 'dashboard')]
    public function show(Request $request): Response
    {
        $route = 'page_list';
        $route = $request->query->get('route', $route);
        return $this->render('dashboard/index.html.twig', [
            'elements' => $this->dashboardService->getElements(),
            'route' => $route,
        ]);
    }
}
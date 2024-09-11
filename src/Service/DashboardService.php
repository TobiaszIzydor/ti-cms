<?php

namespace App\Service;

use App\Entity\DashboardMenu;

class DashboardService
{
    private array $elements = [];
    public function __construct(){
        $this->elements[] = new DashboardMenu("Dashboard", "tipanel_templates", "dashboard");
        $this->elements[] = new DashboardMenu("Pages", "page_list", "description", [['label'=>'All pages', 'action'=>'page_list'], ['label'=>'Templates', 'action'=>'tipanel_templates' ]]);
        $this->elements[] = new DashboardMenu("Media", "tipanel_media", "photo_library");
        $this->elements[] = new DashboardMenu("Plugins", "page_list", "extension");
    }
    
    public function addElement(string $label, string $action, ?string $icon=null, ?array $items=null)
    {
        $element = new DashboardMenu($label, $action, $icon, $items);
        $this->elements[] = $element;
    }

    public function getElements(): array
    {
        return $this->elements;
    }
}
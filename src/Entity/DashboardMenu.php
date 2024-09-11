<?php

namespace App\Entity;

class DashboardMenu
{
    private string $label;
    private string $action;
    private ?string $icon;
    private ?array $items;

    public function __construct(string $label, string $action, ?string $icon=null, ?array $items=null)
    {
        $this->label = $label;
        $this->action = $action;
        $this->icon = $icon;
        $this->items = $items;
    }
    public function getLabel(): string
    {
        return $this->label;
    }

    public function getIcon(): ?string
    {
        return $this->icon;
    }

    public function getItems(): ?array
    {
        return $this->items;
    }

    public function getAction(): string
    {
        return $this->action;
    }
}